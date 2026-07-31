export const RICH_TEXT_MAX_TEXT_LENGTH = 50_000
export const RICH_TEXT_MAX_NODE_COUNT = 500
export const RICH_TEXT_MAX_DEPTH = 20
export const RICH_TEXT_MAX_LINK_LENGTH = 2_048

export const RICH_TEXT_ALLOWED_NODE_TYPES = [
  'doc',
  'paragraph',
  'text',
  'heading',
  'bulletList',
  'orderedList',
  'listItem',
  'blockquote',
  'hardBreak',
] as const

export const RICH_TEXT_ALLOWED_MARK_TYPES = ['bold', 'italic', 'link'] as const

export const RICH_TEXT_ALLOWED_HEADING_LEVELS = [2, 3] as const

export const RICH_TEXT_ALLOWED_NODE_ATTRS: Record<string, readonly string[]> = {
  doc: [],
  paragraph: [],
  text: ['text'],
  heading: ['level'],
  bulletList: [],
  orderedList: [],
  listItem: [],
  blockquote: [],
  hardBreak: [],
}

export const RICH_TEXT_ALLOWED_MARK_ATTRS: Record<string, readonly string[]> = {
  bold: [],
  italic: [],
  link: ['href'],
}
