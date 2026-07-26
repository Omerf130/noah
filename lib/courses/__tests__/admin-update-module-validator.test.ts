import { describe, expect, it } from 'vitest'
import {
  extractAllowlistedUpdateModuleFields,
  parseAdminUpdateModuleFormInput,
  parseSubmittedUpdateModuleIds,
  preserveUpdateModuleValues,
} from '../validators/admin-update-module'

const COURSE_ID = '507f1f77bcf86cd799439011'
const MODULE_ID = '507f1f77bcf86cd799439012'

function buildRaw(overrides: Record<string, string> = {}) {
  return {
    title: 'פרק מעודכן',
    description: 'תיאור מעודכן',
    publicationStatus: 'published',
    courseId: COURSE_ID,
    moduleId: MODULE_ID,
    slug: 'forged-slug',
    order: '999',
    lessonCount: '3',
    ...overrides,
  }
}

describe('admin update module validator', () => {
  it('accepts valid update metadata', () => {
    const result = parseAdminUpdateModuleFormInput(buildRaw())

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('פרק מעודכן')
      expect(result.data.publicationStatus).toBe('published')
    }
  })

  it('allows clearing description', () => {
    const result = parseAdminUpdateModuleFormInput(buildRaw({ description: '   ' }))

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.description).toBeUndefined()
    }
  })

  it('parses submitted course and module ids', () => {
    const parsed = parseSubmittedUpdateModuleIds(buildRaw())

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.courseId).toBe(COURSE_ID)
      expect(parsed.moduleId).toBe(MODULE_ID)
    }
  })

  it('rejects invalid submitted ids', () => {
    expect(parseSubmittedUpdateModuleIds(buildRaw({ moduleId: 'bad-id' })).success).toBe(false)
  })

  it('ignores forged slug, order, and lessonCount from FormData extraction', () => {
    const formData = new FormData()
    formData.set('title', 'פרק')
    formData.set('description', 'תיאור')
    formData.set('publicationStatus', 'draft')
    formData.set('courseId', COURSE_ID)
    formData.set('moduleId', MODULE_ID)
    formData.set('slug', 'forged-slug')
    formData.set('order', '100')
    formData.set('lessonCount', '9')

    const raw = extractAllowlistedUpdateModuleFields(formData)
    expect(raw.slug).toBeUndefined()
    expect(raw.order).toBeUndefined()
    expect(raw.lessonCount).toBeUndefined()

    const parsed = parseAdminUpdateModuleFormInput(raw)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect('slug' in parsed.data).toBe(false)
      expect('order' in parsed.data).toBe(false)
    }
  })

  it('preserves update form values including ids', () => {
    const preserved = preserveUpdateModuleValues(buildRaw())

    expect(preserved.courseId).toBe(COURSE_ID)
    expect(preserved.moduleId).toBe(MODULE_ID)
    expect(preserved.title).toBe('פרק מעודכן')
  })
})
