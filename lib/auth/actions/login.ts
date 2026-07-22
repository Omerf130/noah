'use server'

import { redirect } from 'next/navigation'
import { connectDb } from '../../db/connect'
import { User } from '../../db/models/User'
import { getClientIp } from '../get-client-ip'
import { verifyPassword } from '../password'
import { revalidatePublicNavigation } from '../revalidate-public-nav'
import {
  checkLoginRateLimit,
  clearLoginRateLimits,
  recordLoginFailure,
} from '../rate-limit'
import { createUserSession, destroyUserSession } from '../session'
import type { UserRole } from '../types'
import { parseLoginInput } from '../validation'
import {
  GENERIC_AUTH_ERROR,
  GENERIC_LOGIN_ERROR,
  formatRateLimitFormError,
  mapZodFieldErrors,
  type AuthActionState,
} from './action-state'
import {
  extractAllowlistedLoginFields,
  isLoginSuccessful,
  preserveLoginEmail,
  resolvePostLoginPath,
  selectPasswordHashForVerification,
} from './auth-flow-helpers'

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = extractAllowlistedLoginFields(formData)
  const parsed = parseLoginInput({
    email: raw.email,
    password: raw.password,
  })

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: mapZodFieldErrors(parsed.error),
      values: preserveLoginEmail(typeof raw.email === 'string' ? raw.email : ''),
    }
  }

  const returnTo = typeof raw.returnTo === 'string' ? raw.returnTo : null
  let redirectRole: UserRole | null = null

  try {
    const ip = await getClientIp()
    const rateLimit = await checkLoginRateLimit(ip, parsed.data.email)

    if (!rateLimit.allowed) {
      return {
        success: false,
        formError: formatRateLimitFormError(rateLimit),
        values: preserveLoginEmail(parsed.data.email),
      }
    }

    await connectDb()

    const user = await User.findOne({ email: parsed.data.email })
      .select('+passwordHash')
      .lean()

    const userForVerification = user
      ? {
          passwordHash: String(user.passwordHash),
          isActive: Boolean(user.isActive),
          role: user.role as UserRole,
        }
      : null

    const passwordHash = selectPasswordHashForVerification(userForVerification)
    const passwordMatches = await verifyPassword(parsed.data.password, passwordHash)

    if (!isLoginSuccessful(userForVerification, passwordMatches) || !user) {
      await recordLoginFailure(ip, parsed.data.email)

      return {
        success: false,
        formError: GENERIC_LOGIN_ERROR,
        values: preserveLoginEmail(parsed.data.email),
      }
    }

    await clearLoginRateLimits(ip, parsed.data.email)
    await destroyUserSession()
    await createUserSession(user._id.toString())
    revalidatePublicNavigation()
    redirectRole = user.role as UserRole
  } catch (error) {
    console.error('Login failed', {
      error: error instanceof Error ? error.message : 'Unknown login error',
    })

    return {
      success: false,
      formError: GENERIC_AUTH_ERROR,
      values: preserveLoginEmail(parsed.data.email),
    }
  }

  redirect(resolvePostLoginPath(redirectRole ?? 'student', returnTo))
}
