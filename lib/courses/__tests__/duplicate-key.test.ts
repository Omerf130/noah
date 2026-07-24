import { describe, expect, it } from 'vitest'
import { getCourseDuplicateKeyField } from '../services/duplicate-key'

describe('getCourseDuplicateKeyField', () => {
  it('maps internalName conflicts from keyPattern', () => {
    expect(
      getCourseDuplicateKeyField({
        code: 11000,
        keyPattern: { internalName: 1 },
      }),
    ).toBe('internalName')
  })

  it('maps slug conflicts from keyValue', () => {
    expect(
      getCourseDuplicateKeyField({
        code: 11000,
        keyValue: { slug: 'duplicate-slug' },
      }),
    ).toBe('slug')
  })

  it('returns unknown for non-duplicate errors', () => {
    expect(getCourseDuplicateKeyField(new Error('other'))).toBe('unknown')
  })
})
