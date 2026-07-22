import 'server-only'

import {
  clearSessionCookie,
  readSessionTokenFromCookies,
  setSessionCookie,
} from './session-cookie'
import {
  createSessionRecord,
  findSafeUserByRawSessionToken,
  invalidateSessionByRawToken,
} from './session-store'
import { extractRawSessionToken } from './session-token-parse'
import type { SafeUser } from './types'

export async function createUserSession(userId: string): Promise<void> {
  const rawToken = await createSessionRecord(userId)
  await setSessionCookie(rawToken)
}

export async function getCurrentUserFromSession(): Promise<SafeUser | null> {
  const cookieValue = await readSessionTokenFromCookies()
  const rawToken = extractRawSessionToken(cookieValue)

  if (!rawToken) {
    return null
  }

  return findSafeUserByRawSessionToken(rawToken)
}

export async function destroyUserSession(): Promise<void> {
  const cookieValue = await readSessionTokenFromCookies()
  const rawToken = extractRawSessionToken(cookieValue)

  if (rawToken) {
    await invalidateSessionByRawToken(rawToken)
  }

  await clearSessionCookie()
}
