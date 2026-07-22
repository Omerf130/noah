import { describe, expect, it } from 'vitest'
import {
  decideAdminCreateAction,
  decideAdminPromotionAction,
  isPromotionConfirmed,
  parseAdminCreateInput,
  parseAdminPromotionEmail,
} from '../admin-provisioning'

describe('parseAdminCreateInput', () => {
  it('accepts valid admin input and normalizes email', () => {
    const result = parseAdminCreateInput({
      fullName: 'Admin User',
      email: ' Admin@Example.com ',
      password: 'Password1',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'Password1',
      })
    }
  })

  it('rejects invalid email', () => {
    const result = parseAdminCreateInput({
      fullName: 'Admin User',
      email: 'not-an-email',
      password: 'Password1',
    })

    expect(result.success).toBe(false)
  })

  it('rejects weak password', () => {
    const result = parseAdminCreateInput({
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'short1',
    })

    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = parseAdminCreateInput({
      fullName: ' ',
      email: 'admin@example.com',
      password: 'Password1',
    })

    expect(result.success).toBe(false)
  })
})

describe('parseAdminPromotionEmail', () => {
  it('normalizes promotion email', () => {
    const result = parseAdminPromotionEmail(' Admin@Example.com ')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.email).toBe('admin@example.com')
    }
  })
})

describe('decideAdminCreateAction', () => {
  it('creates when no user exists', () => {
    expect(decideAdminCreateAction(null)).toEqual({ type: 'create' })
  })

  it('does not silently promote an existing student', () => {
    expect(
      decideAdminCreateAction({
        email: 'student@example.com',
        role: 'student',
        isActive: true,
      }),
    ).toEqual({ type: 'existing_student' })
  })

  it('does not recreate an existing admin', () => {
    expect(
      decideAdminCreateAction({
        email: 'admin@example.com',
        role: 'admin',
        isActive: true,
      }),
    ).toEqual({ type: 'existing_admin' })
  })

  it('does not silently reactivate inactive users', () => {
    expect(
      decideAdminCreateAction({
        email: 'inactive@example.com',
        role: 'student',
        isActive: false,
      }),
    ).toEqual({ type: 'inactive_user' })
  })
})

describe('decideAdminPromotionAction', () => {
  it('requires an existing active student for promotion', () => {
    expect(decideAdminPromotionAction(null)).toEqual({ type: 'user_not_found' })
    expect(
      decideAdminPromotionAction({
        email: 'student@example.com',
        role: 'student',
        isActive: true,
      }),
    ).toEqual({ type: 'promote' })
  })

  it('fails for inactive users and existing admins', () => {
    expect(
      decideAdminPromotionAction({
        email: 'inactive@example.com',
        role: 'student',
        isActive: false,
      }),
    ).toEqual({ type: 'inactive_user' })

    expect(
      decideAdminPromotionAction({
        email: 'admin@example.com',
        role: 'admin',
        isActive: true,
      }),
    ).toEqual({ type: 'already_admin' })
  })
})

describe('isPromotionConfirmed', () => {
  it('accepts only the explicit true confirmation value', () => {
    expect(isPromotionConfirmed('true')).toBe(true)
    expect(isPromotionConfirmed('TRUE')).toBe(false)
    expect(isPromotionConfirmed(undefined)).toBe(false)
  })
})
