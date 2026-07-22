import type { UserDocument } from '../db/models/User'
import type { SafeUser, UserRole } from './types'

export function toSafeUser(user: UserDocument): SafeUser {
  return {
    id: user._id.toString(),
    fullName: String(user.fullName),
    email: String(user.email),
    role: user.role as UserRole,
    isActive: Boolean(user.isActive),
    createdAt: user.createdAt as Date,
    updatedAt: user.updatedAt as Date,
  }
}
