import { describe, expect, it } from 'vitest'
import {
  extractAllowlistedUpdateLessonFields,
  parseAdminUpdateLessonFormInput,
  parseSubmittedUpdateLessonIds,
  preserveUpdateLessonValues,
} from '../validators/admin-update-lesson'

const COURSE_ID = '507f1f77bcf86cd799439011'
const MODULE_ID = '507f1f77bcf86cd799439012'
const LESSON_ID = '507f1f77bcf86cd799439013'

function buildRaw(overrides: Record<string, string> = {}) {
  return {
    title: 'שיעור מעודכן',
    description: 'תיאור מעודכן',
    publicationStatus: 'published',
    courseId: COURSE_ID,
    moduleId: MODULE_ID,
    lessonId: LESSON_ID,
    slug: 'forged-slug',
    order: '999',
    blockCount: '3',
    ...overrides,
  }
}

describe('admin update lesson validator', () => {
  it('accepts valid update metadata', () => {
    const result = parseAdminUpdateLessonFormInput(buildRaw())

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('שיעור מעודכן')
      expect(result.data.publicationStatus).toBe('published')
    }
  })

  it('allows clearing description', () => {
    const result = parseAdminUpdateLessonFormInput(buildRaw({ description: '   ' }))

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.description).toBeUndefined()
    }
  })

  it('parses submitted course, module, and lesson ids', () => {
    const parsed = parseSubmittedUpdateLessonIds(buildRaw())

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.courseId).toBe(COURSE_ID)
      expect(parsed.moduleId).toBe(MODULE_ID)
      expect(parsed.lessonId).toBe(LESSON_ID)
    }
  })

  it('rejects invalid submitted ids', () => {
    expect(parseSubmittedUpdateLessonIds(buildRaw({ lessonId: 'bad-id' })).success).toBe(false)
  })

  it('ignores forged slug, order, and blockCount from FormData extraction', () => {
    const formData = new FormData()
    formData.set('title', 'שיעור')
    formData.set('description', 'תיאור')
    formData.set('publicationStatus', 'draft')
    formData.set('courseId', COURSE_ID)
    formData.set('moduleId', MODULE_ID)
    formData.set('lessonId', LESSON_ID)
    formData.set('slug', 'forged-slug')
    formData.set('order', '100')
    formData.set('blockCount', '9')

    const raw = extractAllowlistedUpdateLessonFields(formData)
    expect(raw.slug).toBeUndefined()
    expect(raw.order).toBeUndefined()
    expect(raw.blockCount).toBeUndefined()

    const parsed = parseAdminUpdateLessonFormInput(raw)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect('slug' in parsed.data).toBe(false)
      expect('order' in parsed.data).toBe(false)
    }
  })

  it('preserves update form values including ids', () => {
    const preserved = preserveUpdateLessonValues(buildRaw())

    expect(preserved.courseId).toBe(COURSE_ID)
    expect(preserved.moduleId).toBe(MODULE_ID)
    expect(preserved.lessonId).toBe(LESSON_ID)
    expect(preserved.title).toBe('שיעור מעודכן')
  })
})
