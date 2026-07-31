import { connectDb } from '../../db/connect'
import { ContentBlock } from '../../db/models'
import { parseBlockIdParam } from '../validators/content-block'
import { ContentBlockNotFoundError } from './errors'
import { assertLessonBelongsToModule } from './lesson-service'

const CONTENT_BLOCK_NOT_FOUND_MESSAGE = 'בלוק התוכן המבוקש לא נמצא.'

export async function assertContentBlockBelongsToLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
) {
  await connectDb()
  await assertLessonBelongsToModule(courseId, moduleId, lessonId)

  const parsedBlockId = parseBlockIdParam(blockId)
  if (!parsedBlockId.success) {
    throw new ContentBlockNotFoundError(CONTENT_BLOCK_NOT_FOUND_MESSAGE)
  }

  const contentBlock = await ContentBlock.findOne({
    _id: parsedBlockId.blockId,
    courseId,
    moduleId,
    lessonId,
  }).lean()

  if (!contentBlock) {
    throw new ContentBlockNotFoundError(CONTENT_BLOCK_NOT_FOUND_MESSAGE)
  }

  return contentBlock
}
