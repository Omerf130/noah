import { describe, expect, it } from 'vitest'
import { generateSessionToken, hashSessionToken } from '../session-token'

describe('session token hashing', () => {
  it('hashes a known token deterministically', () => {
    const token = 'test-session-token-value'
    const first = hashSessionToken(token)
    const second = hashSessionToken(token)

    expect(first).toBe(second)
    expect(first).toMatch(/^[a-f0-9]{64}$/)
  })

  it('generates unique random tokens', () => {
    const first = generateSessionToken()
    const second = generateSessionToken()

    expect(first).not.toBe(second)
    expect(first.length).toBeGreaterThan(20)
  })
})
