import { describe, expect, it } from 'vitest'
import {
  ADMIN_COURSE_LIST_DTO_KEYS,
  assertAdminCourseListDtoSafety,
  mapToAdminCourseListItemDto,
} from '../mappers/to-admin-course-list-dto'

describe('admin course list authorization safety', () => {
  it('documents the allowed safe DTO surface', () => {
    expect(ADMIN_COURSE_LIST_DTO_KEYS).toContain('instructorName')
    expect(ADMIN_COURSE_LIST_DTO_KEYS).toContain('createdByName')
    expect(ADMIN_COURSE_LIST_DTO_KEYS).not.toContain('instructorId')
    expect(ADMIN_COURSE_LIST_DTO_KEYS).not.toContain('createdBy')
  })

  it('rejects unsafe DTO fields if they appear', () => {
    const dto = mapToAdminCourseListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        title: 'Course',
        internalName: 'course-v1',
        slug: 'course',
        status: 'draft',
        visibility: 'private',
        pricing: { price: 0, currency: 'ILS' },
        featured: false,
        moduleCount: 0,
        lessonCount: 0,
        instructorId: { toString: () => '507f1f77bcf86cd799439012' },
        createdBy: { toString: () => '507f1f77bcf86cd799439012' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new Map(),
    )

    assertAdminCourseListDtoSafety(dto)

    const unsafeDto = { ...dto, instructorId: '507f1f77bcf86cd799439012' }
    expect(() => assertAdminCourseListDtoSafety(unsafeDto)).toThrow(
      'Unsafe admin course list DTO field: instructorId',
    )
  })
})
