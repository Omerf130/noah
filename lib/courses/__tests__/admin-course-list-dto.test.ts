import { describe, expect, it } from 'vitest'
import {
  assertAdminCourseListDtoSafety,
  mapToAdminCourseListItemDto,
  type AdminCourseListLeanCourse,
} from '../mappers/to-admin-course-list-dto'

const CREATOR_DISPLAY_NAME = 'נועה רכ\u043b\u0438\u043d'

const sampleCourse: AdminCourseListLeanCourse = {
  _id: { toString: () => '507f1f77bcf86cd799439011' },
  title: 'Pharmaceutical Calculations',
  internalName: 'pharmaceutical-calculations-v1',
  slug: 'pharmaceutical-calculations',
  category: 'calculations',
  status: 'draft',
  visibility: 'private',
  pricing: {
    price: 120,
    salePrice: 99,
    currency: 'ILS',
  },
  featured: true,
  moduleCount: 2,
  lessonCount: 5,
  estimatedDurationMinutes: 120,
  instructorId: { toString: () => '507f1f77bcf86cd799439012' },
  createdBy: { toString: () => '507f1f77bcf86cd799439012' },
  createdAt: new Date('2026-01-10T10:00:00.000Z'),
  updatedAt: new Date('2026-01-15T12:30:00.000Z'),
}

describe('mapToAdminCourseListItemDto', () => {
  it('maps course fields and resolves user display names', () => {
    const userNamesById = new Map([['507f1f77bcf86cd799439012', CREATOR_DISPLAY_NAME]])
    const dto = mapToAdminCourseListItemDto(sampleCourse, userNamesById)

    expect(dto.id).toBe('507f1f77bcf86cd799439011')
    expect(dto.categoryLabel).toBe('חישובים')
    expect(dto.statusLabel).toBe('טיוטה')
    expect(dto.visibilityLabel).toBe('מוסתר')
    expect(dto.instructorName).toBe(CREATOR_DISPLAY_NAME)
    expect(dto.createdByName).toBe(CREATOR_DISPLAY_NAME)
    expect(dto.featuredLabel).toBe('כן')
    expect(dto.durationLabel).toBe('כשעתיים')
    expect(dto.priceDisplay.regularLabel).toContain('120')
    expect(dto.priceDisplay.saleLabel).toContain('99')
    expect(dto.createdAtLabel).toBeTruthy()
    expect(dto.updatedAtLabel).toBeTruthy()
  })

  it('shows free pricing label for zero-price courses', () => {
    const dto = mapToAdminCourseListItemDto(
      {
        ...sampleCourse,
        pricing: { price: 0, currency: 'ILS' },
      },
      new Map(),
    )

    expect(dto.priceDisplay.isFree).toBe(true)
    expect(dto.priceDisplay.primaryLabel).toBe('חינם')
  })

  it('does not expose raw instructor, creator ids, or internalName', () => {
    const dto = mapToAdminCourseListItemDto(sampleCourse, new Map())
    assertAdminCourseListDtoSafety(dto)

    expect('instructorId' in dto).toBe(false)
    expect('createdBy' in dto).toBe(false)
    expect('internalName' in dto).toBe(false)
    expect(dto.instructorName).toBe('משתמש/ת')
  })
})
