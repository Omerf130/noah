import { describe, expect, it } from 'vitest'
import { SESSION_TTL_MS } from '../constants'
import {
  computeSessionExpiresAt,
  isSessionExpired,
  isSessionValid,
} from '../session-expiration'

describe('session expiration logic', () => {
  it('computes expiry seven days after creation', () => {
    const createdAt = new Date('2026-01-01T12:00:00.000Z')
    const expiresAt = computeSessionExpiresAt(createdAt)

    expect(expiresAt.getTime()).toBe(createdAt.getTime() + SESSION_TTL_MS)
  })

  it('treats expired sessions as invalid', () => {
    const expiresAt = new Date('2026-01-01T00:00:00.000Z')
    const now = new Date('2026-01-02T00:00:00.000Z')

    expect(isSessionExpired(expiresAt, now)).toBe(true)
    expect(isSessionValid(expiresAt, now)).toBe(false)
  })

  it('treats active sessions as valid', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    const expiresAt = new Date('2026-01-02T00:00:00.000Z')

    expect(isSessionExpired(expiresAt, now)).toBe(false)
    expect(isSessionValid(expiresAt, now)).toBe(true)
  })

  it('treats an expiry exactly at now as expired', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')

    expect(isSessionExpired(now, now)).toBe(true)
  })
})
