import { describe, expect, it } from 'vitest'
import {
  buildClearSessionCookieOptions,
  buildSessionCookieOptions,
  getSessionCookieMaxAgeSeconds,
} from '../session-cookie-options'
import { SESSION_COOKIE_NAME, SESSION_TTL_MS } from '../constants'

describe('session cookie options', () => {
  it('aligns max age with the seven-day session TTL', () => {
    expect(getSessionCookieMaxAgeSeconds()).toBe(Math.floor(SESSION_TTL_MS / 1000))
  })

  it('builds secure session cookie options', () => {
    const options = buildSessionCookieOptions('raw-session-token')

    expect(options.name).toBe(SESSION_COOKIE_NAME)
    expect(options.value).toBe('raw-session-token')
    expect(options.httpOnly).toBe(true)
    expect(options.sameSite).toBe('lax')
    expect(options.path).toBe('/')
    expect(options.maxAge).toBe(getSessionCookieMaxAgeSeconds())
  })

  it('builds clear-cookie options with maxAge 0', () => {
    const options = buildClearSessionCookieOptions()

    expect(options.name).toBe(SESSION_COOKIE_NAME)
    expect(options.value).toBe('')
    expect(options.maxAge).toBe(0)
    expect(options.httpOnly).toBe(true)
    expect(options.path).toBe('/')
  })
})
