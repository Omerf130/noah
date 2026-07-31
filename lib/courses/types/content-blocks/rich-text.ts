import type { RICH_TEXT_SCHEMA_VERSION } from '../../constants/content-block'

export type RichTextSchemaVersion = typeof RICH_TEXT_SCHEMA_VERSION

export type RichTextProseMirrorDocument = Record<string, unknown>

export type RichTextBlockData = {
  schemaVersion: RichTextSchemaVersion
  document: RichTextProseMirrorDocument
}
