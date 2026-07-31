import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { ContentBlock, Course, CourseModule, Lesson, User } from '../../db/models'
import { CONTENT_BLOCK_ORDER_GAP } from '../constants/content-block'
import {
  CONTENT_BLOCK_ORDER_CONFLICT_MESSAGE,
  createRichTextContentBlock,
} from '../services/content-block-service'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import { createLessonInModule } from '../services/lesson-service'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const validDocument = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'concurrent' }] }],
} as const

describeIfDb('content block order uniqueness and create retry integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleId: string
  let lessonAId: string
  let lessonBId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []
  const createdContentBlockIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'G3 Order Index Admin',
      email: `g3-order-index-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `g3-order-${runId}`,
        title: 'G3 Order Course',
        slug: `g3-order-${runId}`,
        shortDescription: 'Order index tests.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const courseModule = await createModule(courseId, {
      title: 'Order Module',
      slug: `order-module-${runId}`,
    })
    moduleId = String(courseModule._id)

    const lessonA = await createLessonInModule(courseId, moduleId, {
      title: 'Lesson A',
      publicationStatus: 'draft',
    })
    lessonAId = String(lessonA._id)

    const lessonB = await createLessonInModule(courseId, moduleId, {
      title: 'Lesson B',
      publicationStatus: 'draft',
    })
    lessonBId = String(lessonB._id)
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

  it(
    'allows the same order value in different lessons but not within the same lesson',
    async () => {
      const firstA = await ContentBlock.create({
        courseId,
        moduleId,
        lessonId: lessonAId,
        type: 'richText',
        order: CONTENT_BLOCK_ORDER_GAP,
        richTextData: { schemaVersion: 1, document: validDocument },
      })
      createdContentBlockIds.push(String(firstA._id))

      const firstB = await ContentBlock.create({
        courseId,
        moduleId,
        lessonId: lessonBId,
        type: 'richText',
        order: CONTENT_BLOCK_ORDER_GAP,
        richTextData: { schemaVersion: 1, document: validDocument },
      })
      createdContentBlockIds.push(String(firstB._id))

      await expect(
        ContentBlock.create({
          courseId,
          moduleId,
          lessonId: lessonAId,
          type: 'richText',
          order: CONTENT_BLOCK_ORDER_GAP,
          richTextData: { schemaVersion: 1, document: validDocument },
        }),
      ).rejects.toMatchObject({ code: 11000 })
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'retries create after duplicate-key conflict and succeeds on the next attempt',
    async () => {
      let createCalls = 0
      const createSpy = vi.spyOn(ContentBlock, 'create').mockImplementation(async (data) => {
        createCalls += 1

        if (createCalls === 1) {
          const duplicateError = new Error('duplicate key') as Error & { code: number }
          duplicateError.code = 11000
          throw duplicateError
        }

        createSpy.mockRestore()
        return ContentBlock.create(data)
      })

      const created = await createRichTextContentBlock(courseId, moduleId, lessonAId, validDocument)
      createdContentBlockIds.push(created.blockId)

      expect(createCalls).toBe(2)
      expect(created.order).toBeGreaterThan(0)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'returns a safe Hebrew error after retry exhaustion',
    async () => {
      const createSpy = vi.spyOn(ContentBlock, 'create').mockImplementation(async () => {
        const duplicateError = new Error('duplicate key') as Error & { code: number }
        duplicateError.code = 11000
        throw duplicateError
      })

      await expect(
        createRichTextContentBlock(courseId, moduleId, lessonAId, validDocument),
      ).rejects.toThrow(CONTENT_BLOCK_ORDER_CONFLICT_MESSAGE)

      createSpy.mockRestore()
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
