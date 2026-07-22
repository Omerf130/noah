import { describe, expect, it } from 'vitest'
import { parseLoginInput, parseRegisterInput } from '../validation'

describe('registerSchema password validation', () => {
  it('accepts valid registration input', () => {
    const result = parseRegisterInput({
      fullName: 'Noa Student',
      email: 'Student@Example.com',
      password: 'password1',
      confirmPassword: 'password1',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('student@example.com')
    }
  })

  it('rejects passwords shorter than 8 characters', () => {
    const result = parseRegisterInput({
      fullName: 'Noa Student',
      email: 'student@example.com',
      password: 'pass1',
      confirmPassword: 'pass1',
    })

    expect(result.success).toBe(false)
  })

  it('requires at least one letter', () => {
    const result = parseRegisterInput({
      fullName: 'Noa Student',
      email: 'student@example.com',
      password: '12345678',
      confirmPassword: '12345678',
    })

    expect(result.success).toBe(false)
  })

  it('requires at least one number', () => {
    const result = parseRegisterInput({
      fullName: 'Noa Student',
      email: 'student@example.com',
      password: 'password',
      confirmPassword: 'password',
    })

    expect(result.success).toBe(false)
  })

  it('rejects mismatched confirmPassword', () => {
    const result = parseRegisterInput({
      fullName: 'Noa Student',
      email: 'student@example.com',
      password: 'password1',
      confirmPassword: 'password2',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('confirmPassword'))).toBe(
        true,
      )
    }
  })
})

describe('loginSchema validation', () => {
  it('normalizes email on login', () => {
    const result = parseLoginInput({
      email: '  Admin@Noah-Dev.Local ',
      password: 'secret123',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('admin@noah-dev.local')
    }
  })

  it('requires password', () => {
    const result = parseLoginInput({
      email: 'student@example.com',
      password: '',
    })

    expect(result.success).toBe(false)
  })
})
