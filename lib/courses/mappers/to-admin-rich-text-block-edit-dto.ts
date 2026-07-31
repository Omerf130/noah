import { RICH_TEXT_SCHEMA_VERSION } from '../constants/content-block'
import {
  createEmptyRichTextDocument,
  type RichTextValidatedDocument,
} from '../validators/content-block/rich-text-document'

export type AdminRichTextBlockEditDto = {
  courseId: string
  moduleId: string
  lessonId: string
  lessonTitle: string
  blockId: string
  schemaVersion: typeof RICH_TEXT_SCHEMA_VERSION
  documentJson: string
}

export type AdminRichTextBlockEditLeanBlock = {
  _id: { toString(): string }
  type: string
  order: number
  richTextData?: {
    schemaVersion?: number
    document?: RichTextValidatedDocument
  } | null
}

export const ADMIN_RICH_TEXT_BLOCK_EDIT_DTO_KEYS = [
  'courseId',
  'moduleId',
  'lessonId',
  'lessonTitle',
  'blockId',
  'schemaVersion',
  'documentJson',
] as const satisfies readonly (keyof AdminRichTextBlockEditDto)[]

export function mapToAdminRichTextBlockEditDto(input: {
  courseId: string
  moduleId: string
  lessonId: string
  lessonTitle: string
  block: AdminRichTextBlockEditLeanBlock
}): AdminRichTextBlockEditDto {
  const document = input.block.richTextData?.document ?? createEmptyRichTextDocument()

  return {
    courseId: input.courseId,
    moduleId: input.moduleId,
    lessonId: input.lessonId,
    lessonTitle: input.lessonTitle,
    blockId: input.block._id.toString(),
    schemaVersion: RICH_TEXT_SCHEMA_VERSION,
    documentJson: JSON.stringify(document),
  }
}

export function assertAdminRichTextBlockEditDtoSafety(dto: AdminRichTextBlockEditDto) {
  for (const key of ADMIN_RICH_TEXT_BLOCK_EDIT_DTO_KEYS) {
    if (!(key in dto)) {
      throw new Error(`AdminRichTextBlockEditDto is missing required key: ${key}`)
    }
  }
}

export function mapToAdminRichTextBlockCreateContext(input: {
  courseId: string
  moduleId: string
  lessonId: string
  lessonTitle: string
}): Pick<
  AdminRichTextBlockEditDto,
  'courseId' | 'moduleId' | 'lessonId' | 'lessonTitle' | 'schemaVersion' | 'documentJson'
> {
  return {
    courseId: input.courseId,
    moduleId: input.moduleId,
    lessonId: input.lessonId,
    lessonTitle: input.lessonTitle,
    schemaVersion: RICH_TEXT_SCHEMA_VERSION,
    documentJson: JSON.stringify(createEmptyRichTextDocument()),
  }
}
