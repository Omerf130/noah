import { describe, expect, it } from 'vitest'
import {
  extractAllowlistedCreateModuleFields,
  parseAdminCreateModuleFormInput,
  preserveCreateModuleValues,
} from '../validators/admin-create-module'

function buildRaw(overrides: Record<string, string> = {}) {
  return {
    title: 'פרק חדש',
    description: 'תיאור הפרק',
    publicationStatus: 'draft',
    slug: 'forged-slug',
    courseId: '507f1f77bcf86cd799439099',
    order: '999',
    lessonCount: '5',
    ...overrides,
  }
}

describe('admin create module validator', () => {
  it('accepts valid module metadata', () => {
    const result = parseAdminCreateModuleFormInput(buildRaw())

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('פרק חדש')
      expect(result.data.description).toBe('תיאור הפרק')
      expect(result.data.publicationStatus).toBe('draft')
    }
  })

  it('requires title', () => {
    const result = parseAdminCreateModuleFormInput(buildRaw({ title: '   ' }))

    expect(result.success).toBe(false)
  })

  it('defaults publicationStatus to draft when omitted', () => {
    const raw = buildRaw()
    delete (raw as Record<string, string>).publicationStatus

    const result = parseAdminCreateModuleFormInput(raw)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.publicationStatus).toBe('draft')
    }
  })

  it('accepts explicit published status from allowlisted input', () => {
    const result = parseAdminCreateModuleFormInput(buildRaw({ publicationStatus: 'published' }))

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.publicationStatus).toBe('published')
    }
  })

  it('ignores forged slug and other non-allowlisted fields in FormData extraction', () => {
    const formData = new FormData()
    formData.set('title', 'פרק מאובטח')
    formData.set('description', 'תיאור')
    formData.set('publicationStatus', 'draft')
    formData.set('slug', 'forged-slug')
    formData.set('courseId', '507f1f77bcf86cd799439099')
    formData.set('order', '100')

    const raw = extractAllowlistedCreateModuleFields(formData)
    expect(raw.slug).toBeUndefined()
    expect(raw.courseId).toBeUndefined()
    expect(raw.order).toBeUndefined()

    const parsed = parseAdminCreateModuleFormInput(raw)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect('slug' in parsed.data).toBe(false)
    }
  })

  it('preserves form values for repopulation', () => {
    const preserved = preserveCreateModuleValues(buildRaw({ publicationStatus: 'published' }))

    expect(preserved.title).toBe('פרק חדש')
    expect(preserved.publicationStatus).toBe('published')
  })
})
