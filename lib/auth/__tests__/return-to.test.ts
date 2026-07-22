import { describe, expect, it } from 'vitest'
import {
  resolveDefaultRedirect,
  resolveLoginRedirect,
  sanitizeReturnTo,
} from '../return-to'

describe('sanitizeReturnTo', () => {
  it('accepts safe internal paths', () => {
    expect(sanitizeReturnTo('/dashboard')).toBe('/dashboard')
    expect(sanitizeReturnTo('/admin/users')).toBe('/admin/users')
  })

  it('rejects external and protocol-relative paths', () => {
    expect(sanitizeReturnTo('https://evil.com')).toBeNull()
    expect(sanitizeReturnTo('//evil.com')).toBeNull()
    expect(sanitizeReturnTo('http://evil.com')).toBeNull()
  })

  it('rejects backslashes and encoded bypass attempts', () => {
    expect(sanitizeReturnTo('/dashboard\\evil')).toBeNull()
    expect(sanitizeReturnTo('/%2f%2fevil.com')).toBeNull()
    expect(sanitizeReturnTo('/%5cadmin')).toBeNull()
  })

  it('returns null for empty or missing values', () => {
    expect(sanitizeReturnTo('')).toBeNull()
    expect(sanitizeReturnTo(null)).toBeNull()
    expect(sanitizeReturnTo(undefined)).toBeNull()
  })
})

describe('resolveLoginRedirect', () => {
  it('uses role defaults when returnTo is missing or invalid', () => {
    expect(resolveDefaultRedirect('admin')).toBe('/admin')
    expect(resolveDefaultRedirect('student')).toBe('/dashboard')
    expect(resolveLoginRedirect('admin', null)).toBe('/admin')
    expect(resolveLoginRedirect('student', 'https://evil.com')).toBe('/dashboard')
  })

  it('honors safe returnTo paths', () => {
    expect(resolveLoginRedirect('student', '/dashboard/settings')).toBe('/dashboard/settings')
    expect(resolveLoginRedirect('admin', '/dashboard')).toBe('/dashboard')
  })

  it('blocks students from admin returnTo paths', () => {
    expect(resolveLoginRedirect('student', '/admin')).toBe('/dashboard')
    expect(resolveLoginRedirect('student', '/admin/users')).toBe('/dashboard')
  })
})
