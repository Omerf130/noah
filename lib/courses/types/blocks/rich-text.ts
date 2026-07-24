import type { BlockBase } from './base'

export interface RichTextBlockData {
  format: 'markdown' | 'html'
  content: string
}

export interface RichTextBlock extends BlockBase {
  type: 'richText'
  data: RichTextBlockData
}
