import bcrypt from 'bcrypt'
import { BCRYPT_COST } from './constants'

/**
 * Precomputed bcrypt hash used when no user exists so login can still run
 * bcrypt.compare at constant time without revealing account existence.
 * Plaintext is never stored; this hash is server-only and never sent to clients.
 */
export const DUMMY_PASSWORD_HASH =
  '$2b$12$LIFZjYJYBa2XX8hytrJdOOt1lOEjYErz/WsPbrK2CYoRbseSiFbtG'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST)
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}
