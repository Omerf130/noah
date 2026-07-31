import type { RichTextValidatedDocument } from '../validators/content-block/rich-text-document'
import { renderRichTextDocumentHtml } from '../rendering/rich-text-html'
import { getContentBlockTypeLabel } from '../formatters/content-block-display'
import type { ContentBlockType } from '../constants/content-block'

export type AdminContentBlockListItemDto = {
  id: string
  type: ContentBlockType
  typeLabel: string
  order: number
  positionLabel: string
  summaryPreview: string
  previewHtml: string | null
  previewUnavailableMessage: string | null
  canMoveUp: boolean
  canMoveDown: boolean
}

export type AdminContentBlockListItemLeanBlock = {
  _id: { toString(): string }
  type: ContentBlockType
  order: number
  richTextData?: {
    document?: RichTextValidatedDocument
  } | null
}

export const ADMIN_CONTENT_BLOCK_LIST_ITEM_DTO_KEYS = [
  'id',
  'type',
  'typeLabel',
  'order',
  'positionLabel',
  'summaryPreview',
  'previewHtml',
  'previewUnavailableMessage',
  'canMoveUp',
  'canMoveDown',
] as const satisfies readonly (keyof AdminContentBlockListItemDto)[]

function extractPlainTextFromProseMirror(node: unknown): string {
  if (!node || typeof node !== 'object') {
    return ''
  }

  const record = node as Record<string, unknown>
  const parts: string[] = []

  if (typeof record.text === 'string') {
    parts.push(record.text)
  }

  if (Array.isArray(record.content)) {
    for (const child of record.content) {
      const childText = extractPlainTextFromProseMirror(child)
      if (childText) {
        parts.push(childText)
      }
    }
  }

  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function buildRichTextSummaryPreview(document: RichTextValidatedDocument | undefined): string {
  if (!document) {
    return getContentBlockTypeLabel('richText')
  }

  const plainText = extractPlainTextFromProseMirror(document)
  if (!plainText) {
    return getContentBlockTypeLabel('richText')
  }

  const maxLength = 120
  if (plainText.length <= maxLength) {
    return plainText
  }

  return `${plainText.slice(0, maxLength).trimEnd()}…`
}

function buildPreviewFields(document: RichTextValidatedDocument | undefined): {
  previewHtml: string | null
  previewUnavailableMessage: string | null
} {
  if (!document) {
    return {
      previewHtml: null,
      previewUnavailableMessage: 'לא ניתן להציג תצוגה מקדימה.',
    }
  }

  const rendered = renderRichTextDocumentHtml(document)
  if (!rendered.success) {
    return {
      previewHtml: null,
      previewUnavailableMessage: rendered.message,
    }
  }

  return {
    previewHtml: rendered.html,
    previewUnavailableMessage: null,
  }
}

export function mapToAdminContentBlockListItemDto(
  block: AdminContentBlockListItemLeanBlock,
  position: number,
  totalItems: number,
): AdminContentBlockListItemDto {
  const document = block.richTextData?.document
  const preview = buildPreviewFields(document)

  return {
    id: block._id.toString(),
    type: block.type,
    typeLabel: getContentBlockTypeLabel(block.type),
    order: block.order,
    positionLabel: String(position),
    summaryPreview: buildRichTextSummaryPreview(document),
    previewHtml: preview.previewHtml,
    previewUnavailableMessage: preview.previewUnavailableMessage,
    canMoveUp: totalItems > 1 && position > 1,
    canMoveDown: totalItems > 1 && position < totalItems,
  }
}

export function assertAdminContentBlockListItemDtoSafety(dto: AdminContentBlockListItemDto) {
  for (const key of ADMIN_CONTENT_BLOCK_LIST_ITEM_DTO_KEYS) {
    if (!(key in dto)) {
      throw new Error(`AdminContentBlockListItemDto is missing required key: ${key}`)
    }
  }
}
