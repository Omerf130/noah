import { describe, expect, it } from 'vitest'
import {
  ADMIN_RICH_TEXT_BLOCK_EDIT_DTO_KEYS,
  assertAdminRichTextBlockEditDtoSafety,
  mapToAdminRichTextBlockEditDto,
  mapToAdminRichTextBlockCreateContext,
} from '../mappers/to-admin-rich-text-block-edit-dto'

describe('admin rich text block edit DTO', () => {
  it('maps edit DTO with serialized document JSON only', () => {
    const dto = mapToAdminRichTextBlockEditDto({
      courseId: '507f1f77bcf86cd799439011',
      moduleId: '507f1f77bcf86cd799439012',
      lessonId: '507f1f77bcf86cd799439013',
      lessonTitle: 'שיעור',
      block: {
        _id: { toString: () => '507f1f77bcf86cd799439014' },
        type: 'richText',
        order: 100,
        richTextData: {
          schemaVersion: 1,
          document: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'טקסט' }] }],
          },
        },
      },
    })

    expect(dto.blockId).toBe('507f1f77bcf86cd799439014')
    expect(dto.schemaVersion).toBe(1)
    expect(JSON.parse(dto.documentJson)).toMatchObject({
      type: 'doc',
    })
    assertAdminRichTextBlockEditDtoSafety(dto)
    expect(Object.keys(dto).sort()).toEqual([...ADMIN_RICH_TEXT_BLOCK_EDIT_DTO_KEYS].sort())
  })

  it('creates starter context for new rich text blocks', () => {
    const context = mapToAdminRichTextBlockCreateContext({
      courseId: '507f1f77bcf86cd799439011',
      moduleId: '507f1f77bcf86cd799439012',
      lessonId: '507f1f77bcf86cd799439013',
      lessonTitle: 'שיעור',
    })

    expect(context.schemaVersion).toBe(1)
    expect(JSON.parse(context.documentJson).type).toBe('doc')
  })
})
