import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { ContentBlock, Course, CourseModule, Lesson, User } from '../../db/models'
import { CONTENT_BLOCK_ORDER_GAP, RICH_TEXT_SCHEMA_VERSION } from '../constants/content-block'
import { listAdminLessonContentBlocks } from '../queries/admin-lesson-content-query'
import { assertContentBlockBelongsToLesson } from '../services/content-block-ownership'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import { createLesson } from '../services/lesson-service'
import { ContentBlockNotFoundError, CourseModuleNotFoundError, LessonNotFoundError } from '../services/errors'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('content block ownership and lesson content query integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleId: string
  let foreignCourseId: string
  let foreignModuleId: string
  let lessonId: string
  let foreignLessonId: string
  let contentBlockId: string
  let foreignContentBlockId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []
  const createdLessonIds: string[] = []
  const createdContentBlockIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Content Block G1 Admin',
      email: `content-block-g1-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `content-block-g1-${runId}`,
        title: 'Content Block G1 Course',
        slug: `content-block-g1-${runId}`,
        shortDescription: 'Content block tests.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const foreignCourse = await createCourse(
      {
        internalName: `content-block-g1-foreign-${runId}`,
        title: 'Foreign Course',
        slug: `content-block-g1-foreign-${runId}`,
        shortDescription: 'Foreign course.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    foreignCourseId = String(foreignCourse._id)
    createdCourseIds.push(foreignCourseId)

    const courseModule = await createModule(courseId, {
      title: 'Module With Content Blocks',
      slug: `module-content-blocks-${runId}`,
    })
    moduleId = String(courseModule._id)

    const foreignModule = await createModule(foreignCourseId, {
      title: 'Foreign Module',
      slug: `foreign-module-${runId}`,
    })
    foreignModuleId = String(foreignModule._id)

    const lesson = await createLesson(moduleId, {
      title: 'Lesson With Blocks',
      slug: `lesson-with-blocks-${runId}`,
      status: 'draft',
    })
    lessonId = String(lesson._id)
    createdLessonIds.push(lessonId)

    const foreignLesson = await createLesson(foreignModuleId, {
      title: 'Foreign Lesson',
      slug: `foreign-lesson-${runId}`,
      status: 'draft',
    })
    foreignLessonId = String(foreignLesson._id)
    createdLessonIds.push(foreignLessonId)

    const contentBlock = await ContentBlock.create({
      courseId: new mongoose.Types.ObjectId(courseId),
      moduleId: new mongoose.Types.ObjectId(moduleId),
      lessonId: new mongoose.Types.ObjectId(lessonId),
      type: 'richText',
      order: CONTENT_BLOCK_ORDER_GAP,
      richTextData: {
        schemaVersion: RICH_TEXT_SCHEMA_VERSION,
        document: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'בלוק בדיקה' }],
            },
          ],
        },
      },
    })
    contentBlockId = String(contentBlock._id)
    createdContentBlockIds.push(contentBlockId)

    const foreignContentBlock = await ContentBlock.create({
      courseId: new mongoose.Types.ObjectId(foreignCourseId),
      moduleId: new mongoose.Types.ObjectId(foreignModuleId),
      lessonId: new mongoose.Types.ObjectId(foreignLessonId),
      type: 'richText',
      order: CONTENT_BLOCK_ORDER_GAP,
      richTextData: {
        schemaVersion: RICH_TEXT_SCHEMA_VERSION,
        document: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'בלוק זר' }],
            },
          ],
        },
      },
    })
    foreignContentBlockId = String(foreignContentBlock._id)
    createdContentBlockIds.push(foreignContentBlockId)
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
    if (!hasDatabase) {
      return
    }

    if (createdContentBlockIds.length > 0) {
      await ContentBlock.deleteMany({ _id: { $in: createdContentBlockIds } })
    }

    if (createdLessonIds.length > 0) {
      await Lesson.deleteMany({ _id: { $in: createdLessonIds } })
    }

    if (createdCourseIds.length > 0) {
      await CourseModule.deleteMany({ courseId: { $in: createdCourseIds } })
      await Course.deleteMany({ _id: { $in: createdCourseIds } })
    }

    if (createdUserIds.length > 0) {
      await User.deleteMany({ _id: { $in: createdUserIds } })
    }

    await disconnectDb()
  }, INTEGRATION_TIMEOUT_MS)

  it(
    'listAdminLessonContentBlocks returns ordered blocks for the validated lesson',
    async () => {
      const result = await listAdminLessonContentBlocks(courseId, moduleId, lessonId)

      expect(result).not.toBeNull()
      expect(result?.lessonTitle).toBe('Lesson With Blocks')
      expect(result?.totalItems).toBe(1)
      expect(result?.items[0]?.id).toBe(contentBlockId)
      expect(result?.items[0]?.summaryPreview).toBe('בלוק בדיקה')
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'listAdminLessonContentBlocks returns null for invalid or cross-scope lesson ids',
    async () => {
      await expect(
        listAdminLessonContentBlocks(foreignCourseId, moduleId, lessonId),
      ).resolves.toBeNull()

      await expect(
        listAdminLessonContentBlocks(courseId, foreignModuleId, lessonId),
      ).resolves.toBeNull()

      await expect(
        listAdminLessonContentBlocks(courseId, moduleId, foreignLessonId),
      ).resolves.toBeNull()
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'assertContentBlockBelongsToLesson accepts matching block scope',
    async () => {
      const block = await assertContentBlockBelongsToLesson(
        courseId,
        moduleId,
        lessonId,
        contentBlockId,
      )

      expect(String(block._id)).toBe(contentBlockId)
      expect(block.type).toBe('richText')
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'assertContentBlockBelongsToLesson rejects cross-course, cross-module, and cross-lesson access',
    async () => {
      await expect(
        assertContentBlockBelongsToLesson(foreignCourseId, moduleId, lessonId, contentBlockId),
      ).rejects.toBeInstanceOf(CourseModuleNotFoundError)

      await expect(
        assertContentBlockBelongsToLesson(courseId, foreignModuleId, lessonId, contentBlockId),
      ).rejects.toBeInstanceOf(CourseModuleNotFoundError)

      await expect(
        assertContentBlockBelongsToLesson(courseId, moduleId, foreignLessonId, contentBlockId),
      ).rejects.toBeInstanceOf(LessonNotFoundError)

      await expect(
        assertContentBlockBelongsToLesson(
          courseId,
          moduleId,
          lessonId,
          foreignContentBlockId,
        ),
      ).rejects.toBeInstanceOf(ContentBlockNotFoundError)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
