import mongoose, { type ClientSession } from 'mongoose'
import { connectDb } from '../../db/connect'
import { ContentBlock } from '../../db/models'
import { CONTENT_BLOCK_ORDER_GAP } from '../constants/content-block'
import { parseBlockIdParam } from '../validators/content-block'
import { assertContentBlockBelongsToLesson } from './content-block-ownership'
import {
  assertBulkWriteMatchedAll,
  buildScopedOrderUpdates,
} from './reorder-utils'
import { ContentBlockNotFoundError, CourseValidationError } from './errors'
import { assertLessonBelongsToModule } from './lesson-service'
import { runInTransaction } from './transaction-utils'

const CONTENT_BLOCK_ORDER_SCOPE = {
  courseId: (value: string) => new mongoose.Types.ObjectId(value),
  moduleId: (value: string) => new mongoose.Types.ObjectId(value),
  lessonId: (value: string) => new mongoose.Types.ObjectId(value),
}

function buildLessonScopeFilter(courseId: string, moduleId: string, lessonId: string) {
  return {
    courseId: CONTENT_BLOCK_ORDER_SCOPE.courseId(courseId),
    moduleId: CONTENT_BLOCK_ORDER_SCOPE.moduleId(moduleId),
    lessonId: CONTENT_BLOCK_ORDER_SCOPE.lessonId(lessonId),
  }
}

export async function getOrderedContentBlockIdsInLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  session?: ClientSession,
): Promise<string[]> {
  await connectDb()

  const query = ContentBlock.find(buildLessonScopeFilter(courseId, moduleId, lessonId))
    .sort({ order: 1, _id: 1 })
    .select('_id')

  if (session) {
    query.session(session)
  }

  const blocks = await query.lean()
  return blocks.map((block) => String(block._id))
}

export async function normalizeContentBlockOrdersInLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  session?: ClientSession,
): Promise<void> {
  const orderedIds = await getOrderedContentBlockIdsInLesson(
    courseId,
    moduleId,
    lessonId,
    session,
  )

  if (orderedIds.length === 0) {
    return
  }

  const parentFilter = buildLessonScopeFilter(courseId, moduleId, lessonId)
  const bulkResult = await ContentBlock.bulkWrite(
    buildScopedOrderUpdates(parentFilter, orderedIds, CONTENT_BLOCK_ORDER_GAP),
    session ? { session } : undefined,
  )

  assertBulkWriteMatchedAll(bulkResult.matchedCount, orderedIds.length, 'content block')
}

export async function moveContentBlockInLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
  direction: 'up' | 'down',
): Promise<{ moved: boolean }> {
  await connectDb()
  await assertLessonBelongsToModule(courseId, moduleId, lessonId)

  const parsedBlockId = parseBlockIdParam(blockId)
  if (!parsedBlockId.success) {
    throw new ContentBlockNotFoundError()
  }

  return runInTransaction(async (session) => {
    const blocks = await ContentBlock.find(buildLessonScopeFilter(courseId, moduleId, lessonId))
      .sort({ order: 1, _id: 1 })
      .select('_id order')
      .session(session)
      .lean()

    const currentIndex = blocks.findIndex(
      (block) => String(block._id) === parsedBlockId.blockId,
    )

    if (currentIndex === -1) {
      throw new ContentBlockNotFoundError()
    }

    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === blocks.length - 1)
    ) {
      return { moved: false }
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const currentBlock = blocks[currentIndex]
    const neighborBlock = blocks[targetIndex]

    if (!currentBlock || !neighborBlock) {
      throw new CourseValidationError('לא ניתן להזיז את בלוק התוכן.')
    }

    const scope = buildLessonScopeFilter(courseId, moduleId, lessonId)
    const currentOrder = currentBlock.order
    const neighborOrder = neighborBlock.order

    const currentUpdate = await ContentBlock.updateOne(
      { _id: currentBlock._id, ...scope },
      { $set: { order: neighborOrder } },
      { session },
    )
    assertBulkWriteMatchedAll(currentUpdate.matchedCount, 1, 'content block')

    const neighborUpdate = await ContentBlock.updateOne(
      { _id: neighborBlock._id, ...scope },
      { $set: { order: currentOrder } },
      { session },
    )
    assertBulkWriteMatchedAll(neighborUpdate.matchedCount, 1, 'content block')

    return { moved: true }
  })
}

export async function deleteContentBlockFromLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
): Promise<{ deleted: true; blockId: string }> {
  await connectDb()
  await assertContentBlockBelongsToLesson(courseId, moduleId, lessonId, blockId)

  const parsedBlockId = parseBlockIdParam(blockId)
  if (!parsedBlockId.success) {
    throw new ContentBlockNotFoundError()
  }

  return runInTransaction(async (session) => {
    const deleteResult = await ContentBlock.deleteOne(
      {
        _id: parsedBlockId.blockId,
        ...buildLessonScopeFilter(courseId, moduleId, lessonId),
      },
      { session },
    )

    if (deleteResult.deletedCount !== 1) {
      throw new ContentBlockNotFoundError()
    }

    await normalizeContentBlockOrdersInLesson(courseId, moduleId, lessonId, session)

    return { deleted: true, blockId: parsedBlockId.blockId }
  })
}
