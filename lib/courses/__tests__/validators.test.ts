import { describe, expect, it } from 'vitest'
import { parseCreateCourseInput, parseUpdateCourseInput } from '../validators/course'
import { parseCreateModuleInput, parseReorderModulesInput } from '../validators/module'
import {
  parseCreateLessonInput,
  parseUpdateLessonBlocksInput,
} from '../validators/lesson'
import {
  parseLessonBlock,
  parseLessonBlocks,
} from '../validators/blocks'
import { normalizeInternalName, normalizeSlug } from '../validators/shared'

const VALID_OBJECT_ID = '507f1f77bcf86cd799439011'
const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'

describe('shared course identifiers', () => {
  it('normalizes internal names and slugs', () => {
    expect(normalizeInternalName(' Pharmaceutical-Calculations-V1 ')).toBe(
      'pharmaceutical-calculations-v1',
    )
    expect(normalizeSlug(' My-Course ')).toBe('my-course')
  })
})

describe('parseCreateCourseInput', () => {
  it('accepts valid course input', () => {
    const result = parseCreateCourseInput({
      internalName: 'pharmaceutical-calculations-v1',
      title: 'Pharmaceutical Calculations',
      slug: 'pharmaceutical-calculations',
      shortDescription: 'Short description',
      instructorId: VALID_OBJECT_ID,
      category: 'calculations',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.internalName).toBe('pharmaceutical-calculations-v1')
      expect(result.data.pricing.currency).toBe('ILS')
      expect(result.data.status).toBe('draft')
    }
  })

  it('rejects invalid internalName format', () => {
    const result = parseCreateCourseInput({
      internalName: 'Invalid Name!',
      title: 'Course',
      slug: 'course',
      shortDescription: 'Short description',
      instructorId: VALID_OBJECT_ID,
    })

    expect(result.success).toBe(false)
  })

  it('rejects negative regular price', () => {
    const result = parseCreateCourseInput({
      internalName: 'course-v1',
      title: 'Course',
      slug: 'course',
      shortDescription: 'Short description',
      instructorId: VALID_OBJECT_ID,
      pricing: { price: -1, currency: 'ILS' },
    })

    expect(result.success).toBe(false)
  })

  it('allows zero price', () => {
    const result = parseCreateCourseInput({
      internalName: 'free-course-v1',
      title: 'Free Course',
      slug: 'free-course',
      shortDescription: 'Short description',
      instructorId: VALID_OBJECT_ID,
      pricing: { price: 0, currency: 'ILS' },
    })

    expect(result.success).toBe(true)
  })

  it('rejects salePrice greater than or equal to regular price', () => {
    const result = parseCreateCourseInput({
      internalName: 'sale-course-v1',
      title: 'Sale Course',
      slug: 'sale-course',
      shortDescription: 'Short description',
      instructorId: VALID_OBJECT_ID,
      pricing: { price: 100, salePrice: 100, currency: 'ILS' },
    })

    expect(result.success).toBe(false)
  })
})

describe('parseUpdateCourseInput', () => {
  it('allows partial updates without internalName', () => {
    const result = parseUpdateCourseInput({
      title: 'Updated title',
      featured: true,
    })

    expect(result.success).toBe(true)
  })
})

describe('parseCreateModuleInput', () => {
  it('accepts valid module input', () => {
    const result = parseCreateModuleInput({
      title: 'Module 1',
      slug: 'module-1',
    })

    expect(result.success).toBe(true)
  })
})

describe('parseReorderModulesInput', () => {
  it('requires at least one module id', () => {
    const result = parseReorderModulesInput({ orderedModuleIds: [] })
    expect(result.success).toBe(false)
  })
})

describe('lesson block validators', () => {
  it('accepts a rich text block', () => {
    const result = parseLessonBlock({
      id: VALID_UUID,
      type: 'richText',
      order: 0,
      data: {
        format: 'markdown',
        content: 'Hello world',
      },
    })

    expect(result.success).toBe(true)
  })

  it('accepts a video block with asset reference', () => {
    const result = parseLessonBlock({
      id: VALID_UUID,
      type: 'video',
      order: 1,
      data: {
        videoAssetId: VALID_OBJECT_ID,
        caption: 'Intro',
      },
    })

    expect(result.success).toBe(true)
  })

  it('accepts a divider block with empty data object', () => {
    const result = parseLessonBlock({
      id: VALID_UUID,
      type: 'divider',
      order: 2,
      data: {},
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid block type payloads', () => {
    const result = parseLessonBlock({
      id: VALID_UUID,
      type: 'file',
      order: 0,
      data: {
        mediaAssetId: 'not-an-object-id',
        label: '',
        allowDownload: true,
      },
    })

    expect(result.success).toBe(false)
  })

  it('rejects mixed invalid blocks in an array', () => {
    const result = parseLessonBlocks([
      {
        id: VALID_UUID,
        type: 'callout',
        order: 0,
        data: {
          variant: 'info',
          body: 'Tip',
        },
      },
      {
        id: VALID_UUID,
        type: 'richText',
        order: 1,
        data: {
          format: 'markdown',
          content: '',
        },
      },
    ])

    expect(result.success).toBe(false)
  })
})

describe('parseCreateLessonInput', () => {
  it('accepts lesson input with validated blocks', () => {
    const result = parseCreateLessonInput({
      title: 'Lesson 1',
      slug: 'lesson-1',
      blocks: [
        {
          id: VALID_UUID,
          type: 'richText',
          order: 0,
          data: {
            format: 'html',
            content: '<p>Intro</p>',
          },
        },
      ],
    })

    expect(result.success).toBe(true)
  })
})

describe('parseUpdateLessonBlocksInput', () => {
  it('requires all blocks to be valid', () => {
    const result = parseUpdateLessonBlocksInput({
      blocks: [
        {
          id: VALID_UUID,
          type: 'callout',
          order: 0,
          data: {
            variant: 'warning',
            body: 'Important',
          },
        },
      ],
    })

    expect(result.success).toBe(true)
  })
})
