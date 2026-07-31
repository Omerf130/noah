import { generateHTML } from '@tiptap/html'
import type { RichTextValidatedDocument } from '../validators/content-block/rich-text-document'
import { parseRichTextDocument } from '../validators/content-block/rich-text-document'
import { richTextExtensions } from './rich-text-extensions'

export type RichTextRenderResult =
  | { success: true; html: string }
  | { success: false; message: string }

export function renderRichTextDocumentHtml(documentInput: unknown): RichTextRenderResult {
  const parsed = parseRichTextDocument(documentInput)
  if (!parsed.success) {
    return { success: false, message: parsed.message }
  }

  try {
    const html = generateHTML(parsed.document as RichTextValidatedDocument, richTextExtensions)
    return { success: true, html: sanitizeRichTextHtml(html) }
  } catch {
    return { success: false, message: 'לא ניתן להציג את התוכן.' }
  }
}

function sanitizeRichTextHtml(html: string): string {
  return html
    .replace(/\srel="[^"]*"/gi, '')
    .replace(/<a\b/gi, '<a rel="noopener noreferrer" target="_blank"')
}
