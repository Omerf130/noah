import { SESSION_COOKIE_NAME, SESSION_TTL_MS } from './constants'

export function getSessionCookieMaxAgeSeconds(): number {
  return Math.floor(SESSION_TTL_MS / 1000)
}

export function buildSessionCookieOptions(value: string) {
  return {
    name: SESSION_COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: getSessionCookieMaxAgeSeconds(),
  }
}

export function buildClearSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  }
}
