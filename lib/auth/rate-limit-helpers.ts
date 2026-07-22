import crypto from 'crypto'
import type { AuthAttemptAction, AuthAttemptScope } from '../db/models/AuthAttempt'
import { buildAuthAttemptKey } from '../db/models/AuthAttempt'

export type RateLimitStatus = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function hashRateLimitIdentifier(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export function buildRateLimitKey(
  action: AuthAttemptAction,
  scope: AuthAttemptScope,
  normalizedIdentifier: string,
): string {
  const hashedIdentifier = hashRateLimitIdentifier(normalizedIdentifier)
  return buildAuthAttemptKey(action, scope, hashedIdentifier)
}

export function computeRateLimitStatus(
  count: number,
  maxAttempts: number,
  expiresAt: Date | null,
  now: Date = new Date(),
): RateLimitStatus {
  if (count >= maxAttempts && expiresAt && expiresAt.getTime() > now.getTime()) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((expiresAt.getTime() - now.getTime()) / 1000),
      ),
    }
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxAttempts - count),
    retryAfterSeconds: 0,
  }
}

export function computeWindowExpiry(now: Date, windowMs: number): Date {
  return new Date(now.getTime() + windowMs)
}
