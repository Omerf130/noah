import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { ContentBlock, isDuplicateKeyError } from '../../db/models'
import { CONTENT_BLOCK_ORDER_GAP, RICH_TEXT_SCHEMA_VERSION } from '../constants/content-block'
import type { RichTextValidatedDocument } from '../validators/content-block/rich-text-document'
import { documentsAreEqual, parseRichTextDocumentInput } from '../validators/content-block/rich-text-document'
import { ContentBlockNotFoundError, CourseValidationError } from './errors'
import { assertLessonBelongsToModule } from './lesson-service'
import { assertContentBlockBelongsToLesson } from './content-block-ownership'

const UNSUPPORTED_BLOCK_TYPE_MESSAGE = 'סוג בלוק זה אינו נתמך לעריכה.'
const GENERIC_CONTENT_BLOCK_ERROR = 'אירעה שגיאה בשמירת בלוק התוכן.'
const CONTENT_BLOCK_ORDER_CONFLICT_MESSAGE =
  'לא ניתן ליצור את בלוק התוכן כעת בגלל התנגשות בסדר. נסו שוב.'
const MAX_CONTENT_BLOCK_CREATE_ORDER_RETRIES = 3

async function getNextContentBlockOrder(lessonId: string): Promise<number> {
  const lastBlock = await ContentBlock.findOne({ lessonId })
    .sort({ order: -1 })
    .select('order')
    .lean()

  if (!lastBlock) {
    return CONTENT_BLOCK_ORDER_GAP
  }

  return lastBlock.order + CONTENT_BLOCK_ORDER_GAP
}

export async function createRichTextContentBlock(
  courseId: string,
  moduleId: string,
  lessonId: string,
  documentInput: unknown,
) {
  await connectDb()
  await assertLessonBelongsToModule(courseId, moduleId, lessonId)

  const parsedDocument = parseRichTextDocumentInput(documentInput)
  if (!parsedDocument.success) {
    throw new CourseValidationError(parsedDocument.message)
  }

  let lastError: unknown

  for (let attempt = 0; attempt < MAX_CONTENT_BLOCK_CREATE_ORDER_RETRIES; attempt += 1) {
    const order = await getNextContentBlockOrder(lessonId)

    try {
      const contentBlock = await ContentBlock.create({
        courseId: new mongoose.Types.ObjectId(courseId),
        moduleId: new mongoose.Types.ObjectId(moduleId),
        lessonId: new mongoose.Types.ObjectId(lessonId),
        type: 'richText',
        order,
        richTextData: {
          schemaVersion: RICH_TEXT_SCHEMA_VERSION,
          document: parsedDocument.data,
        },
      })

      return {
        blockId: String(contentBlock._id),
        order: contentBlock.order,
      }
    } catch (error) {
      lastError = error

      if (isDuplicateKeyError(error) && attempt < MAX_CONTENT_BLOCK_CREATE_ORDER_RETRIES - 1) {
        continue
      }

      if (isDuplicateKeyError(error)) {
        throw new CourseValidationError(CONTENT_BLOCK_ORDER_CONFLICT_MESSAGE)
      }

      throw error
    }
  }

  if (isDuplicateKeyError(lastError)) {
    throw new CourseValidationError(CONTENT_BLOCK_ORDER_CONFLICT_MESSAGE)
  }

  throw lastError
}

export async function updateRichTextContentBlock(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
  documentInput: unknown,
) {
  await connectDb()

  const existingBlock = await assertContentBlockBelongsToLesson(
    courseId,
    moduleId,
    lessonId,
    blockId,
  )

  if (existingBlock.type !== 'richText') {
    throw new CourseValidationError(UNSUPPORTED_BLOCK_TYPE_MESSAGE)
  }

  const parsedDocument = parseRichTextDocumentInput(documentInput)
  if (!parsedDocument.success) {
    throw new CourseValidationError(parsedDocument.message)
  }

  const existingDocument = existingBlock.richTextData?.document as RichTextValidatedDocument | undefined
  if (existingDocument && documentsAreEqual(existingDocument, parsedDocument.data)) {
    return { updated: false, blockId }
  }

  const updateResult = await ContentBlock.updateOne(
    {
      _id: existingBlock._id,
      courseId,
      moduleId,
      lessonId,
      type: 'richText',
    },
    {
      $set: {
        'richTextData.schemaVersion': RICH_TEXT_SCHEMA_VERSION,
        'richTextData.document': parsedDocument.data,
      },
    },
  )

  if (updateResult.matchedCount !== 1) {
    throw new ContentBlockNotFoundError()
  }

  return { updated: true, blockId }
}

export {
  GENERIC_CONTENT_BLOCK_ERROR,
  UNSUPPORTED_BLOCK_TYPE_MESSAGE,
  CONTENT_BLOCK_ORDER_CONFLICT_MESSAGE,
}
