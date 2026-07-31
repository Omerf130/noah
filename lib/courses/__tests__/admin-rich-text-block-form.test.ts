import { describe, expect, it } from 'vitest'
import {
  extractAllowlistedRichTextBlockFields,
  parseRichTextBlockFormInput,
} from '../validators/admin-rich-text-block-form'

describe('admin rich text block form validator', () => {
  it('strips forged ownership and ordering fields before parsing', () => {
    const formData = new FormData()
    formData.set('documentJson', JSON.stringify({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'טקסט' }] }],
    }))
    formData.set('courseId', 'forged')
    formData.set('moduleId', 'forged')
    formData.set('lessonId', 'forged')
    formData.set('blockId', 'forged')
    formData.set('order', '999')
    formData.set('type', 'video')
    formData.set('schemaVersion', '9')

    const raw = extractAllowlistedRichTextBlockFields(formData)
    expect(raw.documentJson).toContain('טקסט')
    expect(formData.has('courseId')).toBe(false)
    expect(formData.has('order')).toBe(false)

    const parsed = parseRichTextBlockFormInput(raw)
    expect(parsed.success).toBe(true)
  })
})
