import { SESSION_TTL_MS } from './constants'

export function computeSessionExpiresAt(from: Date = new Date()): Date {
  return new Date(from.getTime() + SESSION_TTL_MS)
}

export function isSessionExpired(expiresAt: Date, now: Date = new Date()): boolean {
  return expiresAt.getTime() <= now.getTime()
}

export function isSessionValid(expiresAt: Date, now: Date = new Date()): boolean {
  return !isSessionExpired(expiresAt, now)
}
