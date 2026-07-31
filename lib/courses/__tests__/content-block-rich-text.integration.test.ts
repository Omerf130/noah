import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { ContentBlock, Course, CourseModule, Lesson, User } from '../../db/models'
import { CONTENT_BLOCK_ORDER_GAP, RICH_TEXT_SCHEMA_VERSION } from '../constants/content-block'
import { listAdminLessonContentBlocks } from '../queries/admin-lesson-content-query'
import { getAdminRichTextBlockEdit } from '../queries/admin-rich-text-block-edit-query'
import {
  createRichTextContentBlock,
  updateRichTextContentBlock,
} from '../services/content-block-service'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import { createLesson } from '../services/lesson-service'
import { CourseValidationError, LessonNotFoundError } from '../services/errors'
import { createEmptyRichTextDocument } from '../validators/content-block/rich-text-document'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const validDocument = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'תוכן בדיקה' }],
    },
  ],
} as const

describeIfDb('rich text content block create and edit integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleId: string
  let foreignCourseId: string
  let foreignModuleId: string
  let lessonId: string
  let foreignLessonId: string
  let blockId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []
  const createdLessonIds: string[] = []
  const createdContentBlockIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Rich Text G2 Admin',
      email: `rich-text-g2-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `rich-text-g2-${runId}`,
        title: 'Rich Text G2 Course',
        slug: `rich-text-g2-${runId}`,
        shortDescription: 'Rich text block tests.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const foreignCourse = await createCourse(
      {
        internalName: `rich-text-g2-foreign-${runId}`,
        title: 'Foreign Course',
        slug: `rich-text-g2-foreign-${runId}`,
        shortDescription: 'Foreign course.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    foreignCourseId = String(foreignCourse._id)
    createdCourseIds.push(foreignCourseId)

    const courseModule = await createModule(courseId, {
      title: 'Module',
      slug: `module-${runId}`,
    })
    moduleId = String(courseModule._id)

    const foreignModule = await createModule(foreignCourseId, {
      title: 'Foreign Module',
      slug: `foreign-module-${runId}`,
    })
    foreignModuleId = String(foreignModule._id)

    const lesson = await createLesson(moduleId, {
      title: 'Lesson',
      slug: `lesson-${runId}`,
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
    'creates a rich text block with server-assigned order and type',
    async () => {
      const result = await createRichTextContentBlock(courseId, moduleId, lessonId, validDocument)
      blockId = result.blockId
      createdContentBlockIds.push(blockId)

      const stored = await ContentBlock.findById(blockId).lean()
      expect(stored).not.toBeNull()
      expect(stored?.type).toBe('richText')
      expect(stored?.order).toBe(CONTENT_BLOCK_ORDER_GAP)
      expect(stored?.richTextData?.schemaVersion).toBe(RICH_TEXT_SCHEMA_VERSION)
      expect(stored?.richTextData?.document).toMatchObject(validDocument)
      expect(String(stored?.courseId)).toBe(courseId)
      expect(String(stored?.moduleId)).toBe(moduleId)
      expect(String(stored?.lessonId)).toBe(lessonId)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects cross-scope create attempts and invalid documents',
    async () => {
      await expect(
        createRichTextContentBlock(foreignCourseId, moduleId, lessonId, validDocument),
      ).rejects.toBeInstanceOf(LessonNotFoundError)

      await expect(
        createRichTextContentBlock(courseId, foreignModuleId, lessonId, validDocument),
      ).rejects.toBeInstanceOf(LessonNotFoundError)

      await expect(
        createRichTextContentBlock(courseId, moduleId, foreignLessonId, validDocument),
      ).rejects.toBeInstanceOf(LessonNotFoundError)

      await expect(
        createRichTextContentBlock(courseId, moduleId, lessonId, {
          type: 'doc',
          content: [{ type: 'image' }],
        }),
      ).rejects.toBeInstanceOf(CourseValidationError)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'updates rich text document without changing order or ownership',
    async () => {
      const updatedDocument = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'תוכן מעודכן' }],
          },
        ],
      }

      const result = await updateRichTextContentBlock(
        courseId,
        moduleId,
        lessonId,
        blockId,
        updatedDocument,
      )
      expect(result.updated).toBe(true)

      const stored = await ContentBlock.findById(blockId).lean()
      expect(stored?.order).toBe(CONTENT_BLOCK_ORDER_GAP)
      expect(stored?.richTextData?.document).toMatchObject(updatedDocument)
      expect(String(stored?.courseId)).toBe(courseId)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'returns no-op when document is unchanged',
    async () => {
      const stored = await ContentBlock.findById(blockId).lean()
      const result = await updateRichTextContentBlock(
        courseId,
        moduleId,
        lessonId,
        blockId,
        stored?.richTextData?.document ?? createEmptyRichTextDocument(),
      )

      expect(result.updated).toBe(false)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'loads edit DTO and list preview for the created block',
    async () => {
      const editDto = await getAdminRichTextBlockEdit(courseId, moduleId, lessonId, blockId)
      expect(editDto).not.toBeNull()
      expect(editDto?.blockId).toBe(blockId)
      expect(JSON.parse(editDto?.documentJson ?? '{}')).toMatchObject({
        type: 'doc',
      })

      const list = await listAdminLessonContentBlocks(courseId, moduleId, lessonId)
      expect(list?.totalItems).toBe(1)
      expect(list?.items[0]?.previewHtml).toContain('תוכן מעודכן')
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'assigns increasing order for subsequent creates',
    async () => {
      const second = await createRichTextContentBlock(courseId, moduleId, lessonId, validDocument)
      createdContentBlockIds.push(second.blockId)

      const stored = await ContentBlock.findById(second.blockId).lean()
      expect(stored?.order).toBe(CONTENT_BLOCK_ORDER_GAP * 2)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
