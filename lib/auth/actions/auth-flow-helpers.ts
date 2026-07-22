import { DUMMY_PASSWORD_HASH } from '../password'
import type { UserRole } from '../types'
import { resolveLoginRedirect } from '../return-to'

type LoginUserRecord = {
  passwordHash: string
  isActive: boolean
  role: UserRole
} | null

export function selectPasswordHashForVerification(user: LoginUserRecord): string {
  if (!user || !user.isActive) {
    return DUMMY_PASSWORD_HASH
  }

  return user.passwordHash
}

export function isLoginSuccessful(
  user: LoginUserRecord,
  passwordMatches: boolean,
): user is NonNullable<LoginUserRecord> {
  return Boolean(user && user.isActive && passwordMatches)
}

export function resolvePostLoginPath(role: UserRole, returnTo: string | null | undefined): string {
  return resolveLoginRedirect(role, returnTo ?? null)
}

export function extractAllowlistedRegisterFields(formData: FormData) {
  return {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }
}

export function extractAllowlistedLoginFields(formData: FormData) {
  return {
    email: formData.get('email'),
    password: formData.get('password'),
    returnTo: formData.get('returnTo'),
  }
}

export function buildStudentUserCreatePayload(input: {
  fullName: string
  email: string
  passwordHash: string
}) {
  return {
    fullName: input.fullName,
    email: input.email,
    passwordHash: input.passwordHash,
    role: 'student' as const,
    isActive: true as const,
  }
}

export function preserveRegisterValues(input: {
  fullName?: string | null
  email?: string | null
}) {
  return {
    fullName: typeof input.fullName === 'string' ? input.fullName : '',
    email: typeof input.email === 'string' ? input.email : '',
  }
}

export function preserveLoginEmail(email: string) {
  return { email }
}
