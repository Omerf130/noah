import { describe, expect, it } from 'vitest'
import { renderRichTextDocumentHtml } from '../rendering/rich-text-html'

describe('rich text html rendering', () => {
  it('renders safe preview html for validated documents', () => {
    const rendered = renderRichTextDocumentHtml({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'קישור',
              marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
            },
          ],
        },
      ],
    })

    expect(rendered.success).toBe(true)
    if (rendered.success) {
      expect(rendered.html).toContain('https://example.com')
      expect(rendered.html).toContain('rel="noopener noreferrer"')
      expect(rendered.html).toContain('target="_blank"')
    }
  })

  it('fails safely for invalid stored documents', () => {
    const rendered = renderRichTextDocumentHtml({
      type: 'doc',
      content: [{ type: 'image' }],
    })

    expect(rendered.success).toBe(false)
  })

  it('rejects raw html input and never renders script content', () => {
    const rawHtml = renderRichTextDocumentHtml('<img src=x onerror=alert(1)>')
    expect(rawHtml.success).toBe(false)

    const safeRendered = renderRichTextDocumentHtml({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'safe',
              marks: [{ type: 'link', attrs: { href: 'https://example.com/long/path/that/should/wrap/safely/in/preview' } }],
            },
          ],
        },
      ],
    })

    expect(safeRendered.success).toBe(true)
    if (safeRendered.success) {
      expect(safeRendered.html).not.toContain('<script')
      expect(safeRendered.html).not.toContain('onerror')
    }
  })
})
