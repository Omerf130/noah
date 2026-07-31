import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { ContentBlock, Course, CourseModule, Lesson, User } from '../../db/models'
import { CONTENT_BLOCK_ORDER_GAP } from '../constants/content-block'
import { listAdminModuleLessons } from '../queries/admin-lesson-list-query'
import { getAdminLessonEdit } from '../queries/admin-lesson-edit-query'
import { createRichTextContentBlock } from '../services/content-block-service'
import {
  deleteContentBlockFromLesson,
  moveContentBlockInLesson,
  normalizeContentBlockOrdersInLesson,
} from '../services/content-block-order-service'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import { createLessonInModule, deleteLessonFromModule } from '../services/lesson-service'
import { ContentBlockNotFoundError, CourseModuleNotFoundError, LessonNotFoundError } from '../services/errors'
import { mongoSupportsTransactions } from '../services/transaction-utils'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 20000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const validDocument = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'בלוק' }],
    },
  ],
} as const

const BLOCKS_MESSAGE =
  'לא ניתן למחוק את השיעור משום שקיימים בו בלוקי תוכן. יש להסיר את התוכן תחילה.'

describeIfDb('content block move delete and order integration', () => {
  let supportsTransactions = false
  let actorUserId: string
  let courseId: string
  let moduleId: string
  let foreignCourseId: string
  let foreignModuleId: string
  let foreignLessonId: string
  let lessonId: string
  let firstBlockId: string
  let secondBlockId: string
  let thirdBlockId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []
  const createdContentBlockIds: string[] = []

  beforeAll(async () => {
    await connectDb()
    supportsTransactions = await mongoSupportsTransactions()

    const actor = await User.create({
      fullName: 'G3 Content Block Admin',
      email: `g3-content-block-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `g3-blocks-${runId}`,
        title: 'G3 Blocks Course',
        slug: `g3-blocks-${runId}`,
        shortDescription: 'G3 content block lifecycle.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const foreignCourse = await createCourse(
      {
        internalName: `g3-blocks-foreign-${runId}`,
        title: 'Foreign G3 Course',
        slug: `g3-blocks-foreign-${runId}`,
        shortDescription: 'Foreign course.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    foreignCourseId = String(foreignCourse._id)
    createdCourseIds.push(foreignCourseId)

    const courseModule = await createModule(courseId, {
      title: 'G3 Module',
      slug: `g3-module-${runId}`,
    })
    moduleId = String(courseModule._id)

    const foreignModule = await createModule(foreignCourseId, {
      title: 'Foreign Module',
      slug: `g3-foreign-module-${runId}`,
    })
    foreignModuleId = String(foreignModule._id)

    const lesson = await createLessonInModule(courseId, moduleId, {
      title: 'G3 Lesson',
      publicationStatus: 'draft',
    })
    lessonId = String(lesson._id)

    const foreignLesson = await createLessonInModule(foreignCourseId, foreignModuleId, {
      title: 'Foreign Lesson',
      publicationStatus: 'draft',
    })
    foreignLessonId = String(foreignLesson._id)

    const first = await createRichTextContentBlock(courseId, moduleId, lessonId, validDocument)
    const second = await createRichTextContentBlock(courseId, moduleId, lessonId, validDocument)
    const third = await createRichTextContentBlock(courseId, moduleId, lessonId, validDocument)

    firstBlockId = first.blockId
    secondBlockId = second.blockId
    thirdBlockId = third.blockId
    createdContentBlockIds.push(firstBlockId, secondBlockId, thirdBlockId)
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
    if (!hasDatabase) {
      return
    }

    if (createdContentBlockIds.length > 0) {
      await ContentBlock.deleteMany({ _id: { $in: createdContentBlockIds } })
    }

    await Lesson.deleteMany({ courseId: { $in: createdCourseIds } })
    await CourseModule.deleteMany({ courseId: { $in: createdCourseIds } })

    for (const id of createdCourseIds) {
      await Course.findByIdAndDelete(id)
    }

    for (const id of createdUserIds) {
      await User.deleteOne({ _id: id })
    }

    await disconnectDb()
    await mongoose.connection.close()
  }, INTEGRATION_TIMEOUT_MS)

  async function getOrderedBlockIds() {
    const blocks = await ContentBlock.find({ lessonId }).sort({ order: 1, _id: 1 }).lean()
    return blocks.map((block) => String(block._id))
  }

  it(
    'returns no-op when moving the first block up or the last block down',
    async () => {
      const before = await getOrderedBlockIds()

      const upResult = await moveContentBlockInLesson(
        courseId,
        moduleId,
        lessonId,
        firstBlockId,
        'up',
      )
      expect(upResult.moved).toBe(false)
      expect(await getOrderedBlockIds()).toEqual(before)

      const downResult = await moveContentBlockInLesson(
        courseId,
        moduleId,
        lessonId,
        thirdBlockId,
        'down',
      )
      expect(downResult.moved).toBe(false)
      expect(await getOrderedBlockIds()).toEqual(before)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'moves the middle block up and back down using authoritative neighbors',
    async () => {
      const initial = await getOrderedBlockIds()
      expect(initial).toEqual([firstBlockId, secondBlockId, thirdBlockId])

      await moveContentBlockInLesson(courseId, moduleId, lessonId, secondBlockId, 'up')
      expect(await getOrderedBlockIds()).toEqual([secondBlockId, firstBlockId, thirdBlockId])

      const movedBlock = await ContentBlock.findById(secondBlockId).lean()
      expect(movedBlock?.richTextData?.document).toMatchObject(validDocument)

      await moveContentBlockInLesson(courseId, moduleId, lessonId, secondBlockId, 'down')
      expect(await getOrderedBlockIds()).toEqual(initial)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects cross-scope move attempts',
    async () => {
      await expect(
        moveContentBlockInLesson(foreignCourseId, moduleId, lessonId, secondBlockId, 'up'),
      ).rejects.toBeInstanceOf(CourseModuleNotFoundError)

      await expect(
        moveContentBlockInLesson(courseId, foreignModuleId, lessonId, secondBlockId, 'up'),
      ).rejects.toBeInstanceOf(CourseModuleNotFoundError)

      await expect(
        moveContentBlockInLesson(courseId, moduleId, foreignLessonId, secondBlockId, 'up'),
      ).rejects.toBeInstanceOf(LessonNotFoundError)

      const otherLesson = await createLessonInModule(courseId, moduleId, {
        title: 'Other Lesson',
        publicationStatus: 'draft',
      })

      await expect(
        moveContentBlockInLesson(
          courseId,
          moduleId,
          String(otherLesson._id),
          secondBlockId,
          'up',
        ),
      ).rejects.toBeInstanceOf(ContentBlockNotFoundError)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'normalizes duplicate order values deterministically with stable _id tie-breaking',
    async () => {
      await ContentBlock.updateOne({ _id: secondBlockId }, { $set: { order: CONTENT_BLOCK_ORDER_GAP } })

      await normalizeContentBlockOrdersInLesson(courseId, moduleId, lessonId)

      const blocks = await ContentBlock.find({ lessonId }).sort({ order: 1, _id: 1 }).lean()
      expect(blocks.map((block) => block.order)).toEqual([
        CONTENT_BLOCK_ORDER_GAP,
        CONTENT_BLOCK_ORDER_GAP * 2,
        CONTENT_BLOCK_ORDER_GAP * 3,
      ])
      expect(blocks.map((block) => String(block._id))).toEqual([
        firstBlockId,
        secondBlockId,
        thirdBlockId,
      ])
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'deletes the selected block and normalizes remaining orders',
    async () => {
      await deleteContentBlockFromLesson(courseId, moduleId, lessonId, secondBlockId)
      createdContentBlockIds.splice(createdContentBlockIds.indexOf(secondBlockId), 1)

      expect(await ContentBlock.findById(secondBlockId)).toBeNull()

      const remaining = await ContentBlock.find({ lessonId }).sort({ order: 1, _id: 1 }).lean()
      expect(remaining.map((block) => String(block._id))).toEqual([firstBlockId, thirdBlockId])
      expect(remaining.map((block) => block.order)).toEqual([
        CONTENT_BLOCK_ORDER_GAP,
        CONTENT_BLOCK_ORDER_GAP * 2,
      ])
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'blocks lesson deletion when ContentBlock documents exist',
    async () => {
      await expect(deleteLessonFromModule(courseId, moduleId, lessonId)).rejects.toThrow(
        BLOCKS_MESSAGE,
      )
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'reports blockCount from ContentBlock documents in lesson list and edit queries',
    async () => {
      const list = await listAdminModuleLessons(courseId, moduleId)
      const lessonItem = list?.items.find((item) => item.id === lessonId)

      expect(lessonItem?.blockCount).toBe(2)

      const edit = await getAdminLessonEdit(courseId, moduleId, lessonId)
      expect(edit?.systemSettings.blockCount).toBe(2)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rolls back move swaps when the second update fails',
    async (ctx) => {
      if (!supportsTransactions) {
        ctx.skip()
        return
      }

      const before = await ContentBlock.find({ lessonId }).sort({ order: 1, _id: 1 }).lean()
      const beforeOrders = before.map((block) => ({ id: String(block._id), order: block.order }))

      const updateOneSpy = vi.spyOn(ContentBlock, 'updateOne')
      let updateCalls = 0
      updateOneSpy.mockImplementation(async (...args) => {
        updateCalls += 1
        if (updateCalls === 2) {
          throw new Error('forced move rollback')
        }

        updateOneSpy.mockRestore()
        return ContentBlock.updateOne(...args)
      })

      await expect(
        moveContentBlockInLesson(courseId, moduleId, lessonId, thirdBlockId, 'up'),
      ).rejects.toThrow('forced move rollback')

      updateOneSpy.mockRestore()

      const after = await ContentBlock.find({ lessonId }).sort({ order: 1, _id: 1 }).lean()
      expect(after.map((block) => ({ id: String(block._id), order: block.order }))).toEqual(
        beforeOrders,
      )
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rolls back delete and preserved orders when normalization fails',
    async (ctx) => {
      if (!supportsTransactions) {
        ctx.skip()
        return
      }

      const temp = await createRichTextContentBlock(courseId, moduleId, lessonId, validDocument)
      createdContentBlockIds.push(temp.blockId)

      const before = await ContentBlock.find({ lessonId }).sort({ order: 1, _id: 1 }).lean()
      const beforeOrders = before.map((block) => ({ id: String(block._id), order: block.order }))

      const bulkWriteSpy = vi
        .spyOn(ContentBlock, 'bulkWrite')
        .mockRejectedValueOnce(new Error('forced delete rollback'))

      await expect(
        deleteContentBlockFromLesson(courseId, moduleId, lessonId, temp.blockId),
      ).rejects.toThrow('forced delete rollback')

      bulkWriteSpy.mockRestore()

      expect(await ContentBlock.findById(temp.blockId)).not.toBeNull()

      const after = await ContentBlock.find({ lessonId }).sort({ order: 1, _id: 1 }).lean()
      expect(after.map((block) => ({ id: String(block._id), order: block.order }))).toEqual(
        beforeOrders,
      )
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
