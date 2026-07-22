import { describe, expect, it } from 'vitest'
import type { UserDocument } from '../../db/models/User'
import { toSafeUser } from '../safe-user'

describe('toSafeUser', () => {
  it('maps a user document to SafeUser without passwordHash', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    const user = {
      _id: { toString: () => '507f1f77bcf86cd799439011' },
      fullName: 'Noa Student',
      email: 'student@example.com',
      role: 'student',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    } as unknown as UserDocument

    expect(toSafeUser(user)).toEqual({
      id: '507f1f77bcf86cd799439011',
      fullName: 'Noa Student',
      email: 'student@example.com',
      role: 'student',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
  })
})
