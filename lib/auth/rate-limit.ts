import 'server-only'

import { connectDb } from '../db/connect'
import { AuthAttempt } from '../db/models/AuthAttempt'
import {
  LOGIN_FAILURE_MAX,
  LOGIN_FAILURE_WINDOW_MS,
  REGISTER_ATTEMPT_MAX,
  REGISTER_ATTEMPT_WINDOW_MS,
} from './constants'
import { normalizeEmail } from './normalize-email'
import {
  buildRateLimitKey,
  computeRateLimitStatus,
  hashRateLimitIdentifier,
  type RateLimitStatus,
} from './rate-limit-helpers'

export type { RateLimitStatus } from './rate-limit-helpers'

async function getActiveAttemptCount(key: string): Promise<{
  count: number
  expiresAt: Date | null
}> {
  await connectDb()

  const now = new Date()
  const attempt = await AuthAttempt.findOne({ key, expiresAt: { $gt: now } }).lean()

  return {
    count: attempt?.count ?? 0,
    expiresAt: attempt?.expiresAt ?? null,
  }
}

async function incrementAttempt(
  action: 'login' | 'register',
  scope: 'ip' | 'email',
  normalizedIdentifier: string,
  windowMs: number,
) {
  await connectDb()

  const now = new Date()
  const expiresAt = new Date(now.getTime() + windowMs)
  const identifier = hashRateLimitIdentifier(normalizedIdentifier)
  const key = buildRateLimitKey(action, scope, normalizedIdentifier)

  const active = await AuthAttempt.findOneAndUpdate(
    { key, expiresAt: { $gt: now } },
    { $inc: { count: 1 } },
    { new: true },
  )

  if (active) {
    return active
  }

  return AuthAttempt.findOneAndUpdate(
    { key },
    {
      $set: {
        action,
        scope,
        identifier,
        count: 1,
        windowStart: now,
        expiresAt,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
}

function mergeRateLimitStatuses(first: RateLimitStatus, second: RateLimitStatus): RateLimitStatus {
  if (!first.allowed) {
    return first
  }

  if (!second.allowed) {
    return second
  }

  return {
    allowed: true,
    remaining: Math.min(first.remaining, second.remaining),
    retryAfterSeconds: 0,
  }
}

export async function checkLoginRateLimit(
  ip: string,
  email: string,
): Promise<RateLimitStatus> {
  const normalizedEmail = normalizeEmail(email)
  const ipKey = buildRateLimitKey('login', 'ip', ip)
  const emailKey = buildRateLimitKey('login', 'email', normalizedEmail)
  const now = new Date()

  const [ipAttempt, emailAttempt] = await Promise.all([
    getActiveAttemptCount(ipKey),
    getActiveAttemptCount(emailKey),
  ])

  const ipStatus = computeRateLimitStatus(
    ipAttempt.count,
    LOGIN_FAILURE_MAX,
    ipAttempt.expiresAt,
    now,
  )
  const emailStatus = computeRateLimitStatus(
    emailAttempt.count,
    LOGIN_FAILURE_MAX,
    emailAttempt.expiresAt,
    now,
  )

  return mergeRateLimitStatuses(ipStatus, emailStatus)
}

export async function recordLoginFailure(ip: string, email: string): Promise<void> {
  const normalizedEmail = normalizeEmail(email)

  await Promise.all([
    incrementAttempt('login', 'ip', ip, LOGIN_FAILURE_WINDOW_MS),
    incrementAttempt('login', 'email', normalizedEmail, LOGIN_FAILURE_WINDOW_MS),
  ])
}

export async function clearLoginRateLimits(ip: string, email: string): Promise<void> {
  await connectDb()

  const normalizedEmail = normalizeEmail(email)
  const keys = [
    buildRateLimitKey('login', 'ip', ip),
    buildRateLimitKey('login', 'email', normalizedEmail),
  ]

  await AuthAttempt.deleteMany({ key: { $in: keys } })
}

export async function checkRegistrationRateLimit(ip: string): Promise<RateLimitStatus> {
  const key = buildRateLimitKey('register', 'ip', ip)
  const now = new Date()
  const attempt = await getActiveAttemptCount(key)

  return computeRateLimitStatus(
    attempt.count,
    REGISTER_ATTEMPT_MAX,
    attempt.expiresAt,
    now,
  )
}

export async function recordRegistrationAttempt(ip: string): Promise<void> {
  await incrementAttempt('register', 'ip', ip, REGISTER_ATTEMPT_WINDOW_MS)
}

export async function clearRegistrationRateLimit(ip: string): Promise<void> {
  await connectDb()
  const key = buildRateLimitKey('register', 'ip', ip)
  await AuthAttempt.deleteOne({ key })
}
