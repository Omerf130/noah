import { describe, expect, it } from 'vitest'
import { normalizeEmail } from '../normalize-email'

describe('normalizeEmail', () => {
  it('trims whitespace and lowercases email', () => {
    expect(normalizeEmail('  User@Example.COM  ')).toBe('user@example.com')
  })

  it('handles already normalized email', () => {
    expect(normalizeEmail('student@noah-dev.local')).toBe('student@noah-dev.local')
  })

  it('returns empty string for whitespace-only input', () => {
    expect(normalizeEmail('   ')).toBe('')
  })
})
