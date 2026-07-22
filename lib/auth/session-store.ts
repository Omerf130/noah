import 'server-only'

import mongoose from 'mongoose'
import { connectDb } from '../db/connect'
import { Session } from '../db/models/Session'
import { User } from '../db/models/User'
import { computeSessionExpiresAt, isSessionExpired } from './session-expiration'
import { toSafeUser } from './safe-user'
import { generateSessionToken, hashSessionToken } from './session-token'
import type { SafeUser } from './types'

export async function createSessionRecord(userId: string): Promise<string> {
  await connectDb()

  const rawToken = generateSessionToken()
  const tokenHash = hashSessionToken(rawToken)
  const expiresAt = computeSessionExpiresAt()

  await Session.create({
    userId: new mongoose.Types.ObjectId(userId),
    tokenHash,
    expiresAt,
  })

  return rawToken
}

export async function deleteSessionByTokenHash(tokenHash: string): Promise<void> {
  await connectDb()
  await Session.deleteOne({ tokenHash })
}

async function resolveActiveUserForSession(
  userId: mongoose.Types.ObjectId,
  tokenHash: string,
): Promise<SafeUser | null> {
  const user = await User.findById(userId)

  if (!user || !user.isActive) {
    await Session.deleteOne({ tokenHash })
    return null
  }

  return toSafeUser(user)
}

export async function findSafeUserByRawSessionToken(
  rawToken: string,
): Promise<SafeUser | null> {
  await connectDb()

  const tokenHash = hashSessionToken(rawToken)
  const session = await Session.findOne({ tokenHash }).lean()

  if (!session) {
    return null
  }

  if (isSessionExpired(session.expiresAt)) {
    await Session.deleteOne({ tokenHash })
    return null
  }

  return resolveActiveUserForSession(session.userId, tokenHash)
}

export async function invalidateSessionByRawToken(rawToken: string): Promise<void> {
  await connectDb()
  const tokenHash = hashSessionToken(rawToken)
  await Session.deleteOne({ tokenHash })
}
