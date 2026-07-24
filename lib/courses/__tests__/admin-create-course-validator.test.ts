import { describe, expect, it } from 'vitest'
import { parseAdminCreateCourseFormInput } from '../validators/admin-create-course'

const VALID_OBJECT_ID = '507f1f77bcf86cd799439011'

const validFormInput = {
  title: 'Pharmaceutical Calculations',
  slug: 'pharmaceutical-calculations',
  shortDescription: 'Short description',
  category: 'calculations',
  price: '0',
  currency: 'ILS',
  instructorId: VALID_OBJECT_ID,
}

describe('parseAdminCreateCourseFormInput', () => {
  it('accepts valid create input', () => {
    const result = parseAdminCreateCourseFormInput(validFormInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.pricing.price).toBe(0)
      expect(result.data.pricing.currency).toBe('ILS')
      expect(result.data.visibility).toBe('private')
      expect(result.data.featured).toBe(false)
      expect('internalName' in result.data).toBe(false)
    }
  })

  it('converts duration hours to minutes', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      estimatedDurationHours: '2',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.estimatedDurationMinutes).toBe(120)
    }
  })

  it('allows blank sale price', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      price: '100',
      salePrice: '',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.pricing.salePrice).toBeUndefined()
    }
  })

  it('fails when title is missing', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      title: '',
    })

    expect(result.success).toBe(false)
  })

  it('fails for invalid slug', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      slug: '-invalid-slug-',
    })

    expect(result.success).toBe(false)
  })

  it('fails for negative regular price', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      price: '-1',
    })

    expect(result.success).toBe(false)
  })

  it('allows zero price', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      price: '0',
    })

    expect(result.success).toBe(true)
  })

  it('fails for invalid sale price', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      salePrice: '-5',
    })

    expect(result.success).toBe(false)
  })

  it('fails when salePrice is greater than or equal to regular price', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      price: '100',
      salePrice: '100',
    })

    expect(result.success).toBe(false)
  })

  it('fails for invalid category', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      category: 'invalid-category',
    })

    expect(result.success).toBe(false)
  })

  it('fails for invalid visibility', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      visibility: 'hidden',
    })

    expect(result.success).toBe(false)
  })

  it('fails for invalid duration precision', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      estimatedDurationHours: '1.3',
    })

    expect(result.success).toBe(false)
  })

  it('ignores forged internalName in raw input', () => {
    const result = parseAdminCreateCourseFormInput({
      ...validFormInput,
      internalName: 'forged-name',
    } as Record<string, string>)

    expect(result.success).toBe(true)
    if (result.success) {
      expect('internalName' in result.data).toBe(false)
    }
  })
})
