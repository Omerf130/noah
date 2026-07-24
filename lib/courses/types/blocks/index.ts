export type { BlockBase } from './base'
export type { RichTextBlock, RichTextBlockData } from './rich-text'
export type { VideoBlock, VideoBlockData } from './video'
export type { FileBlock, FileBlockData } from './file'
export type { CalloutBlock, CalloutBlockData } from './callout'
export type { DividerBlock, DividerBlockData } from './divider'

import type { RichTextBlock } from './rich-text'
import type { VideoBlock } from './video'
import type { FileBlock } from './file'
import type { CalloutBlock } from './callout'
import type { DividerBlock } from './divider'

export type LessonBlock =
  | RichTextBlock
  | VideoBlock
  | FileBlock
  | CalloutBlock
  | DividerBlock

export type BlockType = LessonBlock['type']
