import { describe, expect, it } from 'vitest'
import {
  CONTENT_TOO_COMPLEX_MESSAGE,
  CONTENT_TOO_LONG_MESSAGE,
  INVALID_DOCUMENT_MESSAGE,
  createEmptyRichTextDocument,
  documentsAreEqual,
  parseRichTextDocument,
} from '../validators/content-block/rich-text-document'
import {
  RICH_TEXT_MAX_DEPTH,
  RICH_TEXT_MAX_NODE_COUNT,
  RICH_TEXT_MAX_TEXT_LENGTH,
} from '../validators/content-block/rich-text-limits'

const validParagraph = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'שלום' }],
    },
  ],
} as const

describe('rich text document validator', () => {
  it('accepts an empty starter document', () => {
    const emptyDoc = createEmptyRichTextDocument()
    const result = parseRichTextDocument(emptyDoc)
    expect(result.success).toBe(true)
  })

  it('accepts paragraphs, headings, marks, lists, and blockquote', () => {
    const result = parseRichTextDocument({
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'כותרת' }] },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'מודגש', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' ונטוי', marks: [{ type: 'italic' }] },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'פריט' }] }],
            },
          ],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'ראשון' }] }],
            },
          ],
        },
        {
          type: 'blockquote',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'ציטוט' }] }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'קישור',
              marks: [{ type: 'link', attrs: { href: 'https://example.com/path' } }],
            },
          ],
        },
      ],
    })

    expect(result.success).toBe(true)
  })

  it('rejects unsupported heading levels, nodes, and marks', () => {
    expect(parseRichTextDocument({ type: 'doc', content: [{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'H1' }] }] }).success).toBe(false)
    expect(parseRichTextDocument({ type: 'doc', content: [{ type: 'image' }] }).success).toBe(false)
    expect(parseRichTextDocument({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'x', marks: [{ type: 'strike' }] }] }] }).success).toBe(false)
  })

  it('rejects unknown attributes and unsafe links', () => {
    expect(
      parseRichTextDocument({
        type: 'doc',
        content: [{ type: 'paragraph', attrs: { class: 'bad' }, content: [{ type: 'text', text: 'x' }] }],
      }).success,
    ).toBe(false)

    expect(
      parseRichTextDocument({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'js', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] },
            ],
          },
        ],
      }).success,
    ).toBe(false)

    expect(
      parseRichTextDocument({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'data', marks: [{ type: 'link', attrs: { href: 'data:text/plain,hi' } }] },
            ],
          },
        ],
      }).success,
    ).toBe(false)

    expect(
      parseRichTextDocument({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'proto', marks: [{ type: 'link', attrs: { href: '//example.com' } }] },
            ],
          },
        ],
      }).success,
    ).toBe(false)
  })

  it('rejects malformed documents and excessive size', () => {
    expect(parseRichTextDocument(null).success).toBe(false)
    expect(parseRichTextDocument('not-json').success).toBe(false)
    expect(parseRichTextDocument({ type: 'paragraph' }).success).toBe(false)

    const tooMuchText = 'א'.repeat(RICH_TEXT_MAX_TEXT_LENGTH + 1)
    expect(parseRichTextDocument({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: tooMuchText }] }] }).message).toBe(CONTENT_TOO_LONG_MESSAGE)

    let nested: Record<string, unknown> = { type: 'paragraph', content: [{ type: 'text', text: 'a' }] }
    for (let index = 0; index <= RICH_TEXT_MAX_DEPTH + 2; index += 1) {
      nested = { type: 'blockquote', content: [nested] }
    }
    expect(parseRichTextDocument({ type: 'doc', content: [nested] }).success).toBe(false)

    const manyParagraphs = {
      type: 'doc',
      content: Array.from({ length: RICH_TEXT_MAX_NODE_COUNT + 2 }, () => ({
        type: 'paragraph',
        content: [{ type: 'text', text: 'x' }],
      })),
    }
    expect(parseRichTextDocument(manyParagraphs).message).toBe(CONTENT_TOO_COMPLEX_MESSAGE)
  })

  it('rejects raw HTML strings and unsupported nested payloads', () => {
    expect(parseRichTextDocument('<p>hello</p>').success).toBe(false)
    expect(parseRichTextDocument('<script>alert(1)</script>').success).toBe(false)

    expect(
      parseRichTextDocument({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'x', marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }] }],
          },
        ],
      }).success,
    ).toBe(false)

    expect(
      parseRichTextDocument({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'cred',
                marks: [{ type: 'link', attrs: { href: 'https://user:pass@example.com' } }],
              },
            ],
          },
        ],
      }).success,
    ).toBe(false)
  })

  it('parses JSON strings and compares documents', () => {
    const parsed = parseRichTextDocument(JSON.stringify(validParagraph))
    expect(parsed.success).toBe(true)

    if (parsed.success) {
      expect(documentsAreEqual(parsed.document, validParagraph)).toBe(true)
      expect(documentsAreEqual(parsed.document, createEmptyRichTextDocument())).toBe(false)
    }

    expect(parseRichTextDocument(undefined).message).toBe(INVALID_DOCUMENT_MESSAGE)
  })
})
