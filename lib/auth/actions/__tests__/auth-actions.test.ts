import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
  DUPLICATE_EMAIL_ERROR,
  formatRateLimitFormError,
  getFirstFieldError,
  mapZodFieldErrors,
} from '../action-state'
import {
  buildStudentUserCreatePayload,
  extractAllowlistedLoginFields,
  extractAllowlistedRegisterFields,
  isLoginSuccessful,
  preserveRegisterValues,
  resolvePostLoginPath,
  selectPasswordHashForVerification,
} from '../auth-flow-helpers'
import { DUMMY_PASSWORD_HASH } from '../../password'

describe('action-state helpers', () => {
  it('maps Zod errors to field arrays', () => {
    const schema = z.object({
      email: z.string().email('אימייל לא תקין'),
    })
    const result = schema.safeParse({ email: 'bad' })

    expect(result.success).toBe(false)
    if (!result.success) {
      const fieldErrors = mapZodFieldErrors(result.error)
      expect(fieldErrors.email).toEqual(['אימייל לא תקין'])
      expect(getFirstFieldError(fieldErrors, 'email')).toBe('אימייל לא תקין')
    }
  })

  it('formats rate-limit retry messaging safely', () => {
    expect(formatRateLimitFormError({ allowed: false, remaining: 0, retryAfterSeconds: 90 })).toBe(
      'יותר מדי ניסיונות. נסו שוב בעוד 90 שניות.',
    )
  })
})

describe('register flow helpers', () => {
  it('extracts only allowlisted registration fields', () => {
    const formData = new FormData()
    formData.set('fullName', 'Noa')
    formData.set('email', 'student@example.com')
    formData.set('password', 'password1')
    formData.set('confirmPassword', 'password1')
    formData.set('role', 'admin')

    expect(extractAllowlistedRegisterFields(formData)).toEqual({
      fullName: 'Noa',
      email: 'student@example.com',
      password: 'password1',
      confirmPassword: 'password1',
    })
  })

  it('always creates student users with active status', () => {
    expect(
      buildStudentUserCreatePayload({
        fullName: 'Noa',
        email: 'student@example.com',
        passwordHash: 'hash',
      }),
    ).toEqual({
      fullName: 'Noa',
      email: 'student@example.com',
      passwordHash: 'hash',
      role: 'student',
      isActive: true,
    })
  })

  it('preserves safe registration values after failure', () => {
    expect(
      preserveRegisterValues({
        fullName: ' Noa ',
        email: ' Student@Example.com ',
      }),
    ).toEqual({
      fullName: ' Noa ',
      email: ' Student@Example.com ',
    })
  })

  it('uses the duplicate email message constant', () => {
    expect(DUPLICATE_EMAIL_ERROR).toBe('כתובת האימייל כבר בשימוש')
  })
})

describe('login flow helpers', () => {
  it('uses dummy hash when user is missing or inactive', () => {
    expect(selectPasswordHashForVerification(null)).toBe(DUMMY_PASSWORD_HASH)
    expect(
      selectPasswordHashForVerification({
        passwordHash: 'real-hash',
        isActive: false,
        role: 'student',
      }),
    ).toBe(DUMMY_PASSWORD_HASH)
  })

  it('uses real hash for active users', () => {
    expect(
      selectPasswordHashForVerification({
        passwordHash: 'real-hash',
        isActive: true,
        role: 'student',
      }),
    ).toBe('real-hash')
  })

  it('requires active user and matching password for success', () => {
    expect(
      isLoginSuccessful(
        { passwordHash: 'hash', isActive: true, role: 'student' },
        true,
      ),
    ).toBe(true)
    expect(
      isLoginSuccessful(
        { passwordHash: 'hash', isActive: true, role: 'student' },
        false,
      ),
    ).toBe(false)
    expect(isLoginSuccessful(null, false)).toBe(false)
  })

  it('applies safe returnTo and role defaults', () => {
    expect(resolvePostLoginPath('admin', null)).toBe('/admin')
    expect(resolvePostLoginPath('student', null)).toBe('/dashboard')
    expect(resolvePostLoginPath('student', '/admin/users')).toBe('/dashboard')
    expect(resolvePostLoginPath('admin', '/dashboard')).toBe('/dashboard')
  })

  it('extracts only allowlisted login fields', () => {
    const formData = new FormData()
    formData.set('email', 'student@example.com')
    formData.set('password', 'password1')
    formData.set('returnTo', '/dashboard')
    formData.set('role', 'admin')

    expect(extractAllowlistedLoginFields(formData)).toEqual({
      email: 'student@example.com',
      password: 'password1',
      returnTo: '/dashboard',
    })
  })
})

describe('logout safety', () => {
  it('treats missing session token parsing as safe', async () => {
    const { extractRawSessionToken } = await import('../../session-token-parse')
    expect(extractRawSessionToken(undefined)).toBeNull()
    expect(extractRawSessionToken('')).toBeNull()
  })
})
