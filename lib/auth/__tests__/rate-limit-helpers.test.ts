import { describe, expect, it } from 'vitest'
import {
  buildRateLimitKey,
  computeRateLimitStatus,
  computeWindowExpiry,
  hashRateLimitIdentifier,
} from '../rate-limit-helpers'
import {
  LOGIN_FAILURE_MAX,
  LOGIN_FAILURE_WINDOW_MS,
  REGISTER_ATTEMPT_MAX,
} from '../constants'

describe('rate limit helpers', () => {
  it('builds distinct keys for login IP, login email, and registration IP', () => {
    const loginIp = buildRateLimitKey('login', 'ip', '203.0.113.10')
    const loginEmail = buildRateLimitKey('login', 'email', 'student@example.com')
    const registerIp = buildRateLimitKey('register', 'ip', '203.0.113.10')

    expect(loginIp).not.toBe(loginEmail)
    expect(loginIp).not.toBe(registerIp)
    expect(loginEmail).not.toBe(registerIp)
  })

  it('does not embed raw email or IP values in stored keys', () => {
    const email = 'student@example.com'
    const ip = '203.0.113.10'
    const loginEmailKey = buildRateLimitKey('login', 'email', email)
    const loginIpKey = buildRateLimitKey('login', 'ip', ip)

    expect(loginEmailKey.includes(email)).toBe(false)
    expect(loginIpKey.includes(ip)).toBe(false)
    expect(hashRateLimitIdentifier(email)).not.toBe(email)
    expect(hashRateLimitIdentifier(ip)).not.toBe(ip)
  })

  it('computes fixed-window expiry timestamps', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    const expiresAt = computeWindowExpiry(now, LOGIN_FAILURE_WINDOW_MS)

    expect(expiresAt.getTime()).toBe(now.getTime() + LOGIN_FAILURE_WINDOW_MS)
  })

  it('blocks when the active count reaches the configured maximum', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    const expiresAt = new Date('2026-01-01T00:10:00.000Z')

    const blocked = computeRateLimitStatus(LOGIN_FAILURE_MAX, LOGIN_FAILURE_MAX, expiresAt, now)

    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfterSeconds).toBe(600)
  })

  it('allows attempts below the registration limit', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    const expiresAt = new Date('2026-01-01T00:10:00.000Z')

    const allowed = computeRateLimitStatus(
      REGISTER_ATTEMPT_MAX - 1,
      REGISTER_ATTEMPT_MAX,
      expiresAt,
      now,
    )

    expect(allowed.allowed).toBe(true)
    expect(allowed.remaining).toBe(1)
    expect(allowed.retryAfterSeconds).toBe(0)
  })
})
