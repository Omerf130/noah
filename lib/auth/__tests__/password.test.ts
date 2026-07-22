import { describe, expect, it } from 'vitest'
import {
  DUMMY_PASSWORD_HASH,
  hashPassword,
  verifyPassword,
} from '../password'

describe('password utilities', () => {
  it('hashes a password into a bcrypt hash', async () => {
    const hash = await hashPassword('password1')

    expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/)
    expect(hash).not.toBe('password1')
  })

  it('verifies the correct password', async () => {
    const hash = await hashPassword('password1')

    await expect(verifyPassword('password1', hash)).resolves.toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('password1')

    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false)
  })

  it('generates different hashes for the same password because of salt', async () => {
    const first = await hashPassword('password1')
    const second = await hashPassword('password1')

    expect(first).not.toBe(second)
    await expect(verifyPassword('password1', first)).resolves.toBe(true)
    await expect(verifyPassword('password1', second)).resolves.toBe(true)
  })

  it('returns false for malformed bcrypt hashes without throwing', async () => {
    await expect(verifyPassword('password1', 'not-a-bcrypt-hash')).resolves.toBe(false)
  })

  it('keeps the dummy timing hash as a valid bcrypt hash', async () => {
    await expect(
      verifyPassword('__dummy_login_timing_password__', DUMMY_PASSWORD_HASH),
    ).resolves.toBe(true)
    await expect(verifyPassword('wrong-password', DUMMY_PASSWORD_HASH)).resolves.toBe(false)
  })
})
