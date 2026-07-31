import { z } from 'zod'
import {
  RICH_TEXT_ALLOWED_HEADING_LEVELS,
  RICH_TEXT_ALLOWED_MARK_ATTRS,
  RICH_TEXT_ALLOWED_MARK_TYPES,
  RICH_TEXT_ALLOWED_NODE_ATTRS,
  RICH_TEXT_ALLOWED_NODE_TYPES,
  RICH_TEXT_MAX_DEPTH,
  RICH_TEXT_MAX_LINK_LENGTH,
  RICH_TEXT_MAX_NODE_COUNT,
  RICH_TEXT_MAX_TEXT_LENGTH,
} from './rich-text-limits'

export type RichTextDocumentValidationResult =
  | { success: true; document: RichTextValidatedDocument }
  | { success: false; message: string }

export type RichTextValidatedDocument = {
  type: 'doc'
  content: RichTextValidatedNode[]
}

export type RichTextValidatedNode = {
  type: string
  attrs?: Record<string, unknown>
  content?: RichTextValidatedNode[]
  text?: string
  marks?: RichTextValidatedMark[]
}

export type RichTextValidatedMark = {
  type: string
  attrs?: Record<string, unknown>
}

const INVALID_DOCUMENT_MESSAGE = 'מסמך התוכן אינו תקין.'
export const INVALID_LINK_MESSAGE = 'קישור אינו תקין.'
export const CONTENT_TOO_LONG_MESSAGE = 'התוכן ארוך מדי.'
export const CONTENT_TOO_COMPLEX_MESSAGE = 'התוכן מורכב מדי.'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateHttpHttpsUrl(href: unknown): string | null {
  if (typeof href !== 'string') {
    return null
  }

  const trimmed = href.trim()
  if (!trimmed || trimmed.length > RICH_TEXT_MAX_LINK_LENGTH) {
    return null
  }

  if (trimmed.startsWith('//')) {
    return null
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return null
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return null
  }

  if (parsed.username || parsed.password) {
    return null
  }

  return parsed.toString()
}

function validateMark(rawMark: unknown): RichTextValidatedMark | null {
  if (!isPlainObject(rawMark) || typeof rawMark.type !== 'string') {
    return null
  }

  if (!RICH_TEXT_ALLOWED_MARK_TYPES.includes(rawMark.type as (typeof RICH_TEXT_ALLOWED_MARK_TYPES)[number])) {
    return null
  }

  const allowedAttrs = RICH_TEXT_ALLOWED_MARK_ATTRS[rawMark.type] ?? []

  if (rawMark.type === 'link') {
    if (!isPlainObject(rawMark.attrs)) {
      return null
    }

    for (const key of Object.keys(rawMark.attrs)) {
      if (!allowedAttrs.includes(key)) {
        return null
      }
    }

    const href = validateHttpHttpsUrl(rawMark.attrs.href)
    if (!href) {
      return null
    }

    return { type: 'link', attrs: { href } }
  }

  if (rawMark.attrs !== undefined) {
    if (!isPlainObject(rawMark.attrs)) {
      return null
    }

    for (const key of Object.keys(rawMark.attrs)) {
      if (!allowedAttrs.includes(key)) {
        return null
      }
    }
  }

  return { type: rawMark.type }
}

function validateNode(rawNode: unknown, depth: number): RichTextValidatedNode | null {
  if (depth > RICH_TEXT_MAX_DEPTH) {
    return null
  }

  if (!isPlainObject(rawNode) || typeof rawNode.type !== 'string') {
    return null
  }

  if (
    !RICH_TEXT_ALLOWED_NODE_TYPES.includes(rawNode.type as (typeof RICH_TEXT_ALLOWED_NODE_TYPES)[number])
  ) {
    return null
  }

  if (rawNode.type === 'text') {
    if (typeof rawNode.text !== 'string') {
      return null
    }

    const marks: RichTextValidatedMark[] = []
    if (rawNode.marks !== undefined) {
      if (!Array.isArray(rawNode.marks)) {
        return null
      }

      for (const markInput of rawNode.marks) {
        const mark = validateMark(markInput)
        if (!mark) {
          return null
        }
        marks.push(mark)
      }
    }

    return {
      type: 'text',
      text: rawNode.text,
      ...(marks.length > 0 ? { marks } : {}),
    }
  }

  if (rawNode.attrs !== undefined && !isPlainObject(rawNode.attrs)) {
    return null
  }

  const allowedAttrs = RICH_TEXT_ALLOWED_NODE_ATTRS[rawNode.type] ?? []
  const attrs: Record<string, unknown> = {}

  if (isPlainObject(rawNode.attrs)) {
    for (const key of Object.keys(rawNode.attrs)) {
      if (!allowedAttrs.includes(key)) {
        return null
      }
    }
  }

  if (rawNode.type === 'heading') {
    const level = rawNode.attrs?.level
    if (
      typeof level !== 'number' ||
      !RICH_TEXT_ALLOWED_HEADING_LEVELS.includes(level as (typeof RICH_TEXT_ALLOWED_HEADING_LEVELS)[number])
    ) {
      return null
    }
    attrs.level = level
  }

  const content: RichTextValidatedNode[] = []
  if (rawNode.content !== undefined) {
    if (!Array.isArray(rawNode.content)) {
      return null
    }

    for (const child of rawNode.content) {
      const validatedChild = validateNode(child, depth + 1)
      if (!validatedChild) {
        return null
      }
      content.push(validatedChild)
    }
  }

  if (rawNode.type === 'doc' && content.length === 0) {
    return { type: 'doc', content: [] }
  }

  return {
    type: rawNode.type,
    ...(Object.keys(attrs).length > 0 ? { attrs } : {}),
    ...(content.length > 0 ? { content } : {}),
  }
}

function countNodes(node: RichTextValidatedNode): number {
  let count = 1
  if (node.content) {
    for (const child of node.content) {
      count += countNodes(child)
    }
  }
  return count
}

function measureTextLength(node: RichTextValidatedNode): number {
  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text.length
  }

  if (!node.content) {
    return 0
  }

  return node.content.reduce((total, child) => total + measureTextLength(child), 0)
}

export function parseRichTextDocument(input: unknown): RichTextDocumentValidationResult {
  if (input === undefined || input === null) {
    return { success: false, message: INVALID_DOCUMENT_MESSAGE }
  }

  let parsedInput: unknown = input
  if (typeof input === 'string') {
    try {
      parsedInput = JSON.parse(input)
    } catch {
      return { success: false, message: INVALID_DOCUMENT_MESSAGE }
    }
  }

  const document = validateNode(parsedInput, 0)
  if (!document || document.type !== 'doc') {
    return { success: false, message: INVALID_DOCUMENT_MESSAGE }
  }

  const nodeCount = countNodes(document)
  if (nodeCount > RICH_TEXT_MAX_NODE_COUNT) {
    return { success: false, message: CONTENT_TOO_COMPLEX_MESSAGE }
  }

  const textLength = measureTextLength(document)
  if (textLength > RICH_TEXT_MAX_TEXT_LENGTH) {
    return { success: false, message: CONTENT_TOO_LONG_MESSAGE }
  }

  return {
    success: true,
    document: document as RichTextValidatedDocument,
  }
}

export const richTextDocumentInputSchema = z.custom<RichTextValidatedDocument>(
  (value) => parseRichTextDocument(value).success,
  { message: INVALID_DOCUMENT_MESSAGE },
)

export function parseRichTextDocumentInput(input: unknown) {
  const result = parseRichTextDocument(input)
  if (!result.success) {
    return { success: false as const, message: result.message }
  }
  return { success: true as const, data: result.document }
}

export function createEmptyRichTextDocument(): RichTextValidatedDocument {
  return {
    type: 'doc',
    content: [{ type: 'paragraph' }],
  }
}

export function documentsAreEqual(
  left: RichTextValidatedDocument,
  right: RichTextValidatedDocument,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}

export { INVALID_DOCUMENT_MESSAGE }
