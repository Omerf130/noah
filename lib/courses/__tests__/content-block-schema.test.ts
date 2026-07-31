import { describe, expect, it } from 'vitest'
import { CONTENT_BLOCK_TYPES, RICH_TEXT_SCHEMA_VERSION } from '../constants/content-block'
import { ContentBlock } from '../../db/models/ContentBlock'

describe('ContentBlock schema', () => {
  it('registers richText as the only supported block type in G1', () => {
    expect(CONTENT_BLOCK_TYPES).toEqual(['richText'])
  })

  it('requires ownership fields, order, and typed richTextData', () => {
    const schemaPaths = ContentBlock.schema.paths

    expect(schemaPaths.courseId).toBeDefined()
    expect(schemaPaths.moduleId).toBeDefined()
    expect(schemaPaths.lessonId).toBeDefined()
    expect(schemaPaths.type).toBeDefined()
    expect(schemaPaths.order).toBeDefined()
    expect(schemaPaths.richTextData).toBeDefined()

    const richTextDataSchema = ContentBlock.schema.path('richTextData') as {
      schema?: { paths: Record<string, unknown> }
    }
    expect(richTextDataSchema.schema?.paths.schemaVersion).toBeDefined()
    expect(richTextDataSchema.schema?.paths.document).toBeDefined()
  })

  it('defaults richText schemaVersion to 1', () => {
    const schemaVersionPath = ContentBlock.schema.path('richTextData.schemaVersion')
    expect(schemaVersionPath?.options.default).toBe(RICH_TEXT_SCHEMA_VERSION)
  })

  it('defines a unique lessonId + order index and ownership indexes', () => {
    const indexes = ContentBlock.schema.indexes()

    const lessonOrderIndex = indexes.find(([spec, indexOptions]) => {
      const serialized = JSON.stringify(spec)
      return serialized.includes('lessonId') && serialized.includes('order') && indexOptions?.unique === true
    })

    expect(lessonOrderIndex).toBeDefined()

    const serializedIndexes = indexes.map(([spec]) => JSON.stringify(spec))

    expect(
      serializedIndexes.some(
        (entry) =>
          entry.includes('courseId') &&
          entry.includes('moduleId') &&
          entry.includes('lessonId'),
      ),
    ).toBe(true)
  })
})
