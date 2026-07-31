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
})
