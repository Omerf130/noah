import { describe, expect, it } from 'vitest'
import { mapToAdminCourseEditDto } from '../mappers/to-admin-course-edit-dto'
import type { AdminCourseDetailsLeanCourse } from '../mappers/to-admin-course-details-dto'

const sampleCourse: AdminCourseDetailsLeanCourse = {
  _id: { toString: () => '507f1f77bcf86cd799439011' },
  internalName: 'course-v1',
  title: 'Course Title',
  slug: 'course-title',
  shortDescription: 'Short description',
  category: 'calculations',
  status: 'draft',
  visibility: 'private',
  pricing: {
    price: 100,
    salePrice: 80,
    currency: 'ILS',
  },
  featured: false,
  moduleCount: 0,
  lessonCount: 0,
  estimatedDurationMinutes: 90,
  difficulty: 'beginner',
  instructorId: { toString: () => '507f1f77bcf86cd799439012' },
  createdBy: { toString: () => '507f1f77bcf86cd799439012' },
  createdAt: new Date('2026-01-10T10:00:00.000Z'),
  updatedAt: new Date('2026-01-15T12:30:00.000Z'),
}

describe('mapToAdminCourseEditDto', () => {
  it('maps persisted course values into edit form fields', () => {
    const dto = mapToAdminCourseEditDto(sampleCourse)

    expect(dto.courseId).toBe('507f1f77bcf86cd799439011')
    expect(dto.title).toBe('Course Title')
    expect(dto.price).toBe('100')
    expect(dto.salePrice).toBe('80')
    expect(dto.estimatedDurationHours).toBe('1.5')
    expect(dto.difficulty).toBe('beginner')
    expect(dto.status).toBe('draft')
    expect(dto.statusLabel).toBe('טיוטה')
  })
})
