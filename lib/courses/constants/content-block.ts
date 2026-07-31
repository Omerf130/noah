export const CONTENT_BLOCK_TYPES = ['richText'] as const

export type ContentBlockType = (typeof CONTENT_BLOCK_TYPES)[number]

export const CONTENT_BLOCK_ORDER_GAP = 100

export const RICH_TEXT_SCHEMA_VERSION = 1 as const
