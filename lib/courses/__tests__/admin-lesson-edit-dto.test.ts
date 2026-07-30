import { describe, expect, it } from 'vitest'
import {
  ADMIN_LESSON_EDIT_DTO_KEYS,
  ADMIN_LESSON_SYSTEM_SETTINGS_DTO_KEYS,
  assertAdminLessonEditDtoSafety,
  mapToAdminLessonEditDto,
} from '../mappers/to-admin-lesson-edit-dto'

describe('admin lesson edit DTO', () => {
  it('maps form-safe values and system settings separately', () => {
    const dto = mapToAdminLessonEditDto(
      '507f1f77bcf86cd799439011',
      '507f1f77bcf86cd799439012',
      {
        _id: { toString: () => '507f1f77bcf86cd799439013' },
        courseId: { toString: () => '507f1f77bcf86cd799439011' },
        moduleId: { toString: () => '507f1f77bcf86cd799439012' },
        title: 'שיעור לדוגמה',
        slug: 'sample-lesson',
        summary: 'תיאור',
        order: 100,
        status: 'published',
        blockCount: 2,
        createdAt: new Date('2026-01-01T10:00:00.000Z'),
        updatedAt: new Date('2026-01-02T10:00:00.000Z'),
      },
    )

    expect(dto.title).toBe('שיעור לדוגמה')
    expect(dto.description).toBe('תיאור')
    expect(dto.publicationStatus).toBe('published')
    expect(dto.publicationStatusLabel).toBe('מוצג לתלמידים')
    expect(dto.systemSettings.slug).toBe('sample-lesson')
    expect(dto.systemSettings.order).toBe(100)
    expect(dto.systemSettings.blockCount).toBe(2)
    expect('slug' in dto).toBe(false)
    expect('blocks' in dto).toBe(false)
  })

  it('exposes only safe edit DTO keys', () => {
    const dto = mapToAdminLessonEditDto(
      '507f1f77bcf86cd799439011',
      '507f1f77bcf86cd799439012',
      {
        _id: { toString: () => '507f1f77bcf86cd799439013' },
        courseId: { toString: () => '507f1f77bcf86cd799439011' },
        moduleId: { toString: () => '507f1f77bcf86cd799439012' },
        title: 'Safe Lesson',
        slug: 'safe-lesson',
        order: 200,
        status: 'draft',
        blockCount: 0,
        createdAt: new Date('2026-01-01T10:00:00.000Z'),
        updatedAt: new Date('2026-01-02T10:00:00.000Z'),
      },
    )

    assertAdminLessonEditDtoSafety(dto)
    expect(Object.keys(dto).sort()).toEqual([...ADMIN_LESSON_EDIT_DTO_KEYS].sort())
    expect(Object.keys(dto.systemSettings).sort()).toEqual(
      [...ADMIN_LESSON_SYSTEM_SETTINGS_DTO_KEYS].sort(),
    )
  })

  it('rejects DTOs that expose blocks', () => {
    const dto = mapToAdminLessonEditDto(
      '507f1f77bcf86cd799439011',
      '507f1f77bcf86cd799439012',
      {
        _id: { toString: () => '507f1f77bcf86cd799439013' },
        courseId: { toString: () => '507f1f77bcf86cd799439011' },
        moduleId: { toString: () => '507f1f77bcf86cd799439012' },
        title: 'Unsafe',
        slug: 'unsafe',
        order: 100,
        status: 'draft',
        blockCount: 1,
        createdAt: new Date('2026-01-01T10:00:00.000Z'),
        updatedAt: new Date('2026-01-02T10:00:00.000Z'),
      },
    )

    ;(dto as Record<string, unknown>).blocks = [{ id: 'block-1' }]

    expect(() => assertAdminLessonEditDtoSafety(dto)).toThrow(
      'AdminLessonEditDto must not expose blocks',
    )
  })
})
