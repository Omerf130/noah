import { describe, expect, it } from 'vitest'
import {
  ADMIN_CONTENT_BLOCK_LIST_ITEM_DTO_KEYS,
  assertAdminContentBlockListItemDtoSafety,
  mapToAdminContentBlockListItemDto,
} from '../mappers/to-admin-content-block-list-item-dto'

describe('admin content block list item DTO', () => {
  it('maps rich text blocks with preview text and move flags', () => {
    const dto = mapToAdminContentBlockListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        type: 'richText',
        order: 100,
        richTextData: {
          document: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'שלום עולם' }],
              },
            ],
          },
        },
      },
      1,
      2,
    )

    expect(dto.id).toBe('507f1f77bcf86cd799439011')
    expect(dto.type).toBe('richText')
    expect(dto.typeLabel).toBe('טקסט עשיר')
    expect(dto.positionLabel).toBe('1')
    expect(dto.summaryPreview).toBe('שלום עולם')
    expect(dto.previewHtml).toContain('שלום עולם')
    expect(dto.previewUnavailableMessage).toBeNull()
    expect(dto.canMoveUp).toBe(false)
    expect(dto.canMoveDown).toBe(true)
  })

  it('falls back to type label when rich text document is empty', () => {
    const dto = mapToAdminContentBlockListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439012' },
        type: 'richText',
        order: 200,
        richTextData: {
          document: {
            type: 'doc',
            content: [],
          },
        },
      },
      2,
      2,
    )

    expect(dto.summaryPreview).toBe('טקסט עשיר')
    expect(dto.canMoveUp).toBe(true)
    expect(dto.canMoveDown).toBe(false)
  })

  it('exposes only safe DTO keys without raw richTextData', () => {
    const dto = mapToAdminContentBlockListItemDto(
      {
        _id: { toString: () => '507f1f77bcf86cd799439013' },
        type: 'richText',
        order: 100,
        richTextData: {
          document: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Preview' }] }],
          },
        },
      },
      1,
      1,
    )

    assertAdminContentBlockListItemDtoSafety(dto)
    expect(Object.keys(dto).sort()).toEqual([...ADMIN_CONTENT_BLOCK_LIST_ITEM_DTO_KEYS].sort())
    expect('richTextData' in dto).toBe(false)
    expect('document' in dto).toBe(false)
  })
})
