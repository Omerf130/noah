import { describe, expect, it } from 'vitest'
import {
  extractAllowlistedCreateLessonFields,
  parseAdminCreateLessonFormInput,
  preserveCreateLessonValues,
} from '../validators/admin-create-lesson'

function buildRaw(overrides: Record<string, string> = {}) {
  return {
    title: 'שיעור חדש',
    description: 'תיאור השיעור',
    publicationStatus: 'draft',
    slug: 'forged-slug',
    courseId: '507f1f77bcf86cd799439099',
    order: '999',
    lessonId: '507f1f77bcf86cd799439088',
    ...overrides,
  }
}

describe('admin create lesson validator', () => {
  it('accepts valid lesson metadata', () => {
    const result = parseAdminCreateLessonFormInput(buildRaw())

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('שיעור חדש')
      expect(result.data.description).toBe('תיאור השיעור')
      expect(result.data.publicationStatus).toBe('draft')
    }
  })

  it('requires title', () => {
    const result = parseAdminCreateLessonFormInput(buildRaw({ title: '   ' }))

    expect(result.success).toBe(false)
  })

  it('defaults publicationStatus to draft when omitted', () => {
    const raw = buildRaw()
    delete (raw as Record<string, string>).publicationStatus

    const result = parseAdminCreateLessonFormInput(raw)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.publicationStatus).toBe('draft')
    }
  })

  it('accepts explicit published status from allowlisted input', () => {
    const result = parseAdminCreateLessonFormInput(buildRaw({ publicationStatus: 'published' }))

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.publicationStatus).toBe('published')
    }
  })

  it('ignores forged slug and other non-allowlisted fields in FormData extraction', () => {
    const formData = new FormData()
    formData.set('title', 'שיעור מאובטח')
    formData.set('description', 'תיאור')
    formData.set('publicationStatus', 'draft')
    formData.set('slug', 'forged-slug')
    formData.set('courseId', '507f1f77bcf86cd799439099')
    formData.set('order', '100')

    const raw = extractAllowlistedCreateLessonFields(formData)
    expect(raw.slug).toBeUndefined()
    expect(raw.courseId).toBeUndefined()
    expect(raw.order).toBeUndefined()

    const parsed = parseAdminCreateLessonFormInput(raw)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect('slug' in parsed.data).toBe(false)
    }
  })

  it('preserves form values for repopulation', () => {
    const preserved = preserveCreateLessonValues(buildRaw({ publicationStatus: 'published' }))

    expect(preserved.title).toBe('שיעור חדש')
    expect(preserved.publicationStatus).toBe('published')
  })
})
