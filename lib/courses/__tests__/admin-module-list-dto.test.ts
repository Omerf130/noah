import { describe, expect, it } from 'vitest'
import {
  ADMIN_MODULE_LIST_ITEM_DTO_KEYS,
  assertAdminModuleListItemDtoSafety,
  mapToAdminModuleListItemDto,
} from '../mappers/to-admin-module-list-item-dto'

describe('admin module list item DTO', () => {
  it('maps module fields with position and publication labels', () => {
    const dto = mapToAdminModuleListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        title: 'פרק ראשון',
        description: ' תיאור ',
        order: 100,
        publicationStatus: 'published',
        lessonCount: 3,
      },
      1,
    )

    expect(dto.id).toBe('507f1f77bcf86cd799439011')
    expect(dto.title).toBe('פרק ראשון')
    expect(dto.description).toBe('תיאור')
    expect(dto.positionLabel).toBe('1')
    expect(dto.publicationStatus).toBe('published')
    expect(dto.publicationStatusLabel).toBe('מפורסם')
    expect(dto.lessonCount).toBe(3)
    expect(dto.lessonCountLabel).toBe('3')
  })

  it('defaults missing publication status to draft', () => {
    const dto = mapToAdminModuleListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439012' },
        title: 'פרק טיוטה',
        order: 200,
        publicationStatus: 'draft',
        lessonCount: 0,
      },
      2,
    )

    expect(dto.publicationStatus).toBe('draft')
    expect(dto.publicationStatusLabel).toBe('מוסתר')
    expect(dto.description).toBeNull()
  })

  it('exposes only safe DTO keys', () => {
    const dto = mapToAdminModuleListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439013' },
        title: 'Safe Module',
        order: 100,
        publicationStatus: 'draft',
        lessonCount: 0,
      },
      1,
    )

    assertAdminModuleListItemDtoSafety(dto)
    expect(Object.keys(dto).sort()).toEqual([...ADMIN_MODULE_LIST_ITEM_DTO_KEYS].sort())
    expect('slug' in dto).toBe(false)
  })
})
