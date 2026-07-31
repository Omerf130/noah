import { parseRichTextDocumentInput } from '../validators/content-block/rich-text-document'

const FORBIDDEN_SUBMITTED_FIELDS = [
  'courseId',
  'moduleId',
  'lessonId',
  'blockId',
  'order',
  'type',
  'schemaVersion',
] as const

export type RichTextBlockFormFields = {
  documentJson: string
}

export function extractAllowlistedRichTextBlockFields(formData: FormData): RichTextBlockFormFields {
  for (const field of FORBIDDEN_SUBMITTED_FIELDS) {
    if (formData.has(field)) {
      formData.delete(field)
    }
  }

  return {
    documentJson: typeof formData.get('documentJson') === 'string' ? formData.get('documentJson') as string : '',
  }
}

export function parseRichTextBlockFormInput(raw: RichTextBlockFormFields) {
  if (!raw.documentJson.trim()) {
    return { success: false as const, message: 'מסמך התוכן אינו תקין.' }
  }

  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(raw.documentJson) as unknown
  } catch {
    return { success: false as const, message: 'מסמך התוכן אינו תקין.' }
  }

  return parseRichTextDocumentInput(parsedJson)
}

export function preserveRichTextBlockFormValues(raw: RichTextBlockFormFields): RichTextBlockFormFields {
  return {
    documentJson: raw.documentJson,
  }
}
