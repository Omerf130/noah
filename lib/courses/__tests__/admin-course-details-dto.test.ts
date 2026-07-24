import { describe, expect, it } from 'vitest'
import {
  assertAdminCourseDetailsDtoSafety,
  mapToAdminCourseDetailsDto,
  type AdminCourseDetailsLeanCourse,
} from '../mappers/to-admin-course-details-dto'

const sampleCourse: AdminCourseDetailsLeanCourse = {
  _id: { toString: () => '507f1f77bcf86cd799439011' },
  internalName: 'pharmaceutical-calculations-v1',
  title: 'Pharmaceutical Calculations',
  slug: 'pharmaceutical-calculations',
  shortDescription: 'Short course description',
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
  difficulty: 'intermediate',
  instructorId: { toString: () => '507f1f77bcf86cd799439012' },
  createdBy: { toString: () => '507f1f77bcf86cd799439012' },
  createdAt: new Date('2026-01-10T10:00:00.000Z'),
  updatedAt: new Date('2026-01-15T12:30:00.000Z'),
}

describe('mapToAdminCourseDetailsDto', () => {
  it('maps course fields including system settings slug and internalName', () => {
    const dto = mapToAdminCourseDetailsDto(
      sampleCourse,
      new Map([['507f1f77bcf86cd799439012', 'Admin User']]),
    )

    expect(dto.internalName).toBe('pharmaceutical-calculations-v1')
    expect(dto.slug).toBe('pharmaceutical-calculations')
    expect(dto.shortDescription).toBe('Short course description')
    expect(dto.difficultyLabel).toBe('בינוני')
    expect(dto.durationLabel).toBe('כשעתיים')
  })

  it('allows internalName and slug on the details DTO but rejects unsafe ids', () => {
    const dto = mapToAdminCourseDetailsDto(sampleCourse, new Map())

    assertAdminCourseDetailsDtoSafety(dto)

    const unsafeDto = { ...dto, instructorId: '507f1f77bcf86cd799439012' }
    expect(() => assertAdminCourseDetailsDtoSafety(unsafeDto)).toThrow(
      'Unsafe admin course details DTO field: instructorId',
    )
  })
})
