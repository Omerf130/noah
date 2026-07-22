'use server'

import { redirect } from 'next/navigation'
import { connectDb } from '../../db/connect'
import { User, isDuplicateKeyError } from '../../db/models/User'
import { getClientIp } from '../get-client-ip'
import { hashPassword } from '../password'
import { revalidatePublicNavigation } from '../revalidate-public-nav'
import {
  checkRegistrationRateLimit,
  recordRegistrationAttempt,
} from '../rate-limit'
import { createUserSession } from '../session'
import { parseRegisterInput } from '../validation'
import {
  DUPLICATE_EMAIL_ERROR,
  GENERIC_AUTH_ERROR,
  REGISTRATION_SESSION_ERROR,
  formatRateLimitFormError,
  mapZodFieldErrors,
  type AuthActionState,
} from './action-state'
import {
  buildStudentUserCreatePayload,
  extractAllowlistedRegisterFields,
  preserveRegisterValues,
} from './auth-flow-helpers'

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = extractAllowlistedRegisterFields(formData)
  const preservedValues = preserveRegisterValues({
    fullName: raw.fullName as string | null,
    email: raw.email as string | null,
  })
  const parsed = parseRegisterInput(raw)

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: mapZodFieldErrors(parsed.error),
      values: preservedValues,
    }
  }

  try {
    const ip = await getClientIp()
    const rateLimit = await checkRegistrationRateLimit(ip)

    if (!rateLimit.allowed) {
      return {
        success: false,
        formError: formatRateLimitFormError(rateLimit),
        values: preservedValues,
      }
    }

    await recordRegistrationAttempt(ip)
    await connectDb()

    const existingUser = await User.findOne({ email: parsed.data.email }).lean()

    if (existingUser) {
      return {
        success: false,
        fieldErrors: { email: [DUPLICATE_EMAIL_ERROR] },
        values: preservedValues,
      }
    }

    const passwordHash = await hashPassword(parsed.data.password)
    const user = await User.create(
      buildStudentUserCreatePayload({
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        passwordHash,
      }),
    )

    try {
      await createUserSession(user._id.toString())
      revalidatePublicNavigation()
    } catch (sessionError) {
      console.error('Registration session creation failed', {
        userId: user._id.toString(),
        error:
          sessionError instanceof Error ? sessionError.message : 'Unknown session error',
      })

      return {
        success: false,
        formError: REGISTRATION_SESSION_ERROR,
        values: preservedValues,
      }
    }
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return {
        success: false,
        fieldErrors: { email: [DUPLICATE_EMAIL_ERROR] },
        values: preservedValues,
      }
    }

    console.error('Registration failed', {
      error: error instanceof Error ? error.message : 'Unknown registration error',
    })

    return {
      success: false,
      formError: GENERIC_AUTH_ERROR,
      values: preservedValues,
    }
  }

  redirect('/dashboard')
}
