import 'server-only'

import { cookies } from 'next/headers'
import {
  buildClearSessionCookieOptions,
  buildSessionCookieOptions,
} from './session-cookie-options'
import { SESSION_COOKIE_NAME } from './constants'

export async function readSessionTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

export async function setSessionCookie(rawToken: string): Promise<void> {
  const cookieStore = await cookies()
  const options = buildSessionCookieOptions(rawToken)
  cookieStore.set(options.name, options.value, {
    httpOnly: options.httpOnly,
    sameSite: options.sameSite,
    secure: options.secure,
    path: options.path,
    maxAge: options.maxAge,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  const options = buildClearSessionCookieOptions()
  cookieStore.set(options.name, options.value, {
    httpOnly: options.httpOnly,
    sameSite: options.sameSite,
    secure: options.secure,
    path: options.path,
    maxAge: options.maxAge,
  })
}
