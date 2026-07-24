import { describe, expect, it } from 'vitest'
import { parseAdminUpdateCourseFormInput } from '../validators/admin-update-course'

const VALID_OBJECT_ID = '507f1f77bcf86cd799439011'

const validFormInput = {
  title: 'Updated Course',
  slug: 'updated-course',
  shortDescription: 'Updated short description',
  category: 'calculations',
  price: '120',
  salePrice: '99',
  currency: 'ILS',
  estimatedDurationHours: '2',
  difficulty: 'intermediate',
  visibility: 'private',
  featured: 'on',
  instructorId: VALID_OBJECT_ID,
}

describe('parseAdminUpdateCourseFormInput', () => {
  it('accepts valid update input and transforms trusted metadata', () => {
    const result = parseAdminUpdateCourseFormInput(validFormInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('Updated Course')
      expect(result.data.slug).toBe('updated-course')
      expect(result.data.pricing.price).toBe(120)
      expect(result.data.pricing.salePrice).toBe(99)
      expect(result.data.estimatedDurationMinutes).toBe(120)
      expect(result.data.difficulty).toBe('intermediate')
      expect('internalName' in result.data).toBe(false)
      expect('status' in result.data).toBe(false)
    }
  })

  it('rejects invalid slug format', () => {
    const result = parseAdminUpdateCourseFormInput({
      ...validFormInput,
      slug: 'Invalid Slug',
    })

    expect(result.success).toBe(false)
  })

  it('rejects sale price greater than or equal to regular price', () => {
    const result = parseAdminUpdateCourseFormInput({
      ...validFormInput,
      price: '100',
      salePrice: '100',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid quarter-hour duration', () => {
    const result = parseAdminUpdateCourseFormInput({
      ...validFormInput,
      estimatedDurationHours: '1.1',
    })

    expect(result.success).toBe(false)
  })
})
