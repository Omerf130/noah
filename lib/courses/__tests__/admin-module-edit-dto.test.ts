import { describe, expect, it } from 'vitest'
import {
  ADMIN_MODULE_EDIT_DTO_KEYS,
  ADMIN_MODULE_SYSTEM_SETTINGS_DTO_KEYS,
  assertAdminModuleEditDtoSafety,
  mapToAdminModuleEditDto,
} from '../mappers/to-admin-module-edit-dto'

describe('admin module edit DTO', () => {
  it('maps form-safe values and system settings separately', () => {
    const dto = mapToAdminModuleEditDto('507f1f77bcf86cd799439011', {
      _id: { toString: () => '507f1f77bcf86cd799439012' },
      courseId: { toString: () => '507f1f77bcf86cd799439011' },
      title: 'פרק לדוגמה',
      slug: 'sample-module',
      description: 'תיאור',
      publicationStatus: 'published',
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
      updatedAt: new Date('2026-01-02T10:00:00.000Z'),
    })

    expect(dto.title).toBe('פרק לדוגמה')
    expect(dto.publicationStatus).toBe('published')
    expect(dto.publicationStatusLabel).toBe('מוצג לתלמידים')
    expect(dto.systemSettings.slug).toBe('sample-module')
    expect('slug' in dto).toBe(false)
  })

  it('exposes only safe edit DTO keys', () => {
    const dto = mapToAdminModuleEditDto('507f1f77bcf86cd799439011', {
      _id: { toString: () => '507f1f77bcf86cd799439012' },
      courseId: { toString: () => '507f1f77bcf86cd799439011' },
      title: 'Safe Module',
      slug: 'safe-module',
      publicationStatus: 'draft',
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
      updatedAt: new Date('2026-01-02T10:00:00.000Z'),
    })

    assertAdminModuleEditDtoSafety(dto)
    expect(Object.keys(dto).sort()).toEqual([...ADMIN_MODULE_EDIT_DTO_KEYS].sort())
    expect(Object.keys(dto.systemSettings).sort()).toEqual(
      [...ADMIN_MODULE_SYSTEM_SETTINGS_DTO_KEYS].sort(),
    )
  })
})
