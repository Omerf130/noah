import { describe, expect, it } from 'vitest'
import { extractRawSessionToken } from '../session-token-parse'

describe('extractRawSessionToken', () => {
  it('accepts a valid raw token', () => {
    const token = 'a'.repeat(32)
    expect(extractRawSessionToken(token)).toBe(token)
  })

  it('trims surrounding whitespace', () => {
    const token = 'a'.repeat(32)
    expect(extractRawSessionToken(`  ${token}  `)).toBe(token)
  })

  it('rejects missing, empty, or too-short tokens', () => {
    expect(extractRawSessionToken(undefined)).toBeNull()
    expect(extractRawSessionToken(null)).toBeNull()
    expect(extractRawSessionToken('')).toBeNull()
    expect(extractRawSessionToken('short-token')).toBeNull()
  })
})
