import { describe, expect, it } from 'vitest'
import {
  ADMIN_LESSON_LIST_ITEM_DTO_KEYS,
  assertAdminLessonListItemDtoSafety,
  mapToAdminLessonListItemDto,
} from '../mappers/to-admin-lesson-list-item-dto'

describe('admin lesson list item DTO', () => {
  it('maps status to publicationStatus and summary to description', () => {
    const dto = mapToAdminLessonListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        title: 'שיעור ראשון',
        summary: ' תיאור ',
        order: 100,
        status: 'published',
        blocks: [{ id: '1' }, { id: '2' }],
      },
      1,
      2,
    )

    expect(dto.id).toBe('507f1f77bcf86cd799439011')
    expect(dto.title).toBe('שיעור ראשון')
    expect(dto.description).toBe('תיאור')
    expect(dto.positionLabel).toBe('1')
    expect(dto.publicationStatus).toBe('published')
    expect(dto.publicationStatusLabel).toBe('מוצג לתלמידים')
    expect(dto.blockCount).toBe(2)
    expect(dto.blockCountLabel).toBe('2')
  })

  it('defaults unknown status to draft publicationStatus', () => {
    const dto = mapToAdminLessonListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439012' },
        title: 'שיעור טיוטה',
        order: 200,
        status: 'draft',
        blocks: [],
      },
      2,
      0,
    )

    expect(dto.publicationStatus).toBe('draft')
    expect(dto.publicationStatusLabel).toBe('מוסתר')
    expect(dto.description).toBeNull()
    expect(dto.blockCount).toBe(0)
  })

  it('uses explicit blockCount from query instead of embedded blocks length', () => {
    const dto = mapToAdminLessonListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439013' },
        title: 'Blocks Lesson',
        order: 100,
        status: 'draft',
        blocks: [{ id: 'a' }],
      },
      1,
      3,
    )

    expect(dto.blockCount).toBe(3)
    expect(dto.blockCountLabel).toBe('3')
  })

  it('falls back to blocks.length when blockCount is not supplied', () => {
    const dto = mapToAdminLessonListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439015' },
        title: 'Legacy Fallback',
        order: 100,
        status: 'draft',
        blocks: [{ id: 'a' }, { id: 'b' }],
      },
      1,
    )

    expect(dto.blockCount).toBe(2)
  })

  it('exposes only safe DTO keys without estimatedDurationMinutes or raw blocks', () => {
    const dto = mapToAdminLessonListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439014' },
        title: 'Safe Lesson',
        order: 100,
        status: 'draft',
        blocks: [],
      },
      1,
    )

    assertAdminLessonListItemDtoSafety(dto)
    expect(Object.keys(dto).sort()).toEqual([...ADMIN_LESSON_LIST_ITEM_DTO_KEYS].sort())
    expect('estimatedDurationMinutes' in dto).toBe(false)
    expect('blocks' in dto).toBe(false)
    expect('status' in dto).toBe(false)
    expect('summary' in dto).toBe(false)
    expect('slug' in dto).toBe(false)
  })
})
