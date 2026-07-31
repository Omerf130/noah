import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { ContentBlock, Course, CourseModule, Lesson, User } from '../../db/models'
import { createRichTextContentBlock } from '../services/content-block-service'
import { countLessonBlocks } from '../services/outline-service'
import { validateCourseForPublish } from '../services/publish-service'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import { createLessonInModule } from '../services/lesson-service'
import { determineCourseDeletionEligibility } from '../services/course-deletion-service'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 20000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const validDocument = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'publish me' }] }],
} as const

describeIfDb('publish outline and course deletion transitional content integration', () => {
  let actorUserId: string
  let courseWithContentBlockId: string
  let courseWithLegacyId: string
  let courseWithoutContentId: string
  let foreignCourseId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'G3 Publish Admin',
      email: `g3-publish-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const contentBlockCourse = await createCourse(
      {
        internalName: `g3-publish-cb-${runId}`,
        title: 'ContentBlock Publish Course',
        slug: `g3-publish-cb-${runId}`,
        shortDescription: 'Has ContentBlock content.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseWithContentBlockId = String(contentBlockCourse._id)
    createdCourseIds.push(courseWithContentBlockId)

    const legacyCourse = await createCourse(
      {
        internalName: `g3-publish-legacy-${runId}`,
        title: 'Legacy Publish Course',
        slug: `g3-publish-legacy-${runId}`,
        shortDescription: 'Has legacy embedded content.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseWithLegacyId = String(legacyCourse._id)
    createdCourseIds.push(courseWithLegacyId)

    const emptyCourse = await createCourse(
      {
        internalName: `g3-publish-empty-${runId}`,
        title: 'Empty Publish Course',
        slug: `g3-publish-empty-${runId}`,
        shortDescription: 'No lesson content.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseWithoutContentId = String(emptyCourse._id)
    createdCourseIds.push(courseWithoutContentId)

    const foreignCourse = await createCourse(
      {
        internalName: `g3-publish-foreign-${runId}`,
        title: 'Foreign Publish Course',
        slug: `g3-publish-foreign-${runId}`,
        shortDescription: 'Foreign content.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    foreignCourseId = String(foreignCourse._id)
    createdCourseIds.push(foreignCourseId)

    async function seedCourseWithLesson(courseId: string, slugSuffix: string) {
      const courseModule = await createModule(courseId, {
        title: 'Module',
        slug: `module-${slugSuffix}`,
      })
      const moduleId = String(courseModule._id)
      const lesson = await createLessonInModule(courseId, moduleId, {
        title: 'Lesson',
        publicationStatus: 'draft',
      })
      return { moduleId, lessonId: String(lesson._id) }
    }

    const cbLesson = await seedCourseWithLesson(courseWithContentBlockId, `cb-${runId}`)
    await createRichTextContentBlock(
      courseWithContentBlockId,
      cbLesson.moduleId,
      cbLesson.lessonId,
      validDocument,
    )

    const legacyLesson = await seedCourseWithLesson(courseWithLegacyId, `legacy-${runId}`)
    await Lesson.findByIdAndUpdate(legacyLesson.lessonId, {
      $set: {
        blocks: [{ id: 'legacy-1', type: 'richText', order: 0, data: { body: 'legacy' } }],
      },
    })

    await seedCourseWithLesson(courseWithoutContentId, `empty-${runId}`)

    const foreignLesson = await seedCourseWithLesson(foreignCourseId, `foreign-${runId}`)
    await createRichTextContentBlock(
      foreignCourseId,
      foreignLesson.moduleId,
      foreignLesson.lessonId,
      validDocument,
    )
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
    if (!hasDatabase) {
      return
    }

    await ContentBlock.deleteMany({ courseId: { $in: createdCourseIds } })
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
    'treats ContentBlock content as satisfying publish content requirement',
    async () => {
      const issues = await validateCourseForPublish(courseWithContentBlockId)
      expect(issues.some((issue) => issue.code === 'lesson_blocks_missing')).toBe(false)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'treats legacy embedded blocks as satisfying publish content requirement during transition',
    async () => {
      const issues = await validateCourseForPublish(courseWithLegacyId)
      expect(issues.some((issue) => issue.code === 'lesson_blocks_missing')).toBe(false)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'fails publish validation when no lesson has content',
    async () => {
      const issues = await validateCourseForPublish(courseWithoutContentId)
      expect(issues.some((issue) => issue.code === 'lesson_blocks_missing')).toBe(true)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'does not count foreign course ContentBlock toward another course publish requirement',
    async () => {
      const issues = await validateCourseForPublish(courseWithoutContentId)
      expect(issues.some((issue) => issue.code === 'lesson_blocks_missing')).toBe(true)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'counts transitional lesson blocks without double-counting legacy and ContentBlock content',
    async () => {
      expect(await countLessonBlocks(courseWithContentBlockId)).toBe(1)
      expect(await countLessonBlocks(courseWithLegacyId)).toBe(1)
      expect(await countLessonBlocks(courseWithoutContentId)).toBe(0)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'blocks course deletion when ContentBlock documents exist even if legacy asset scan passes',
    async () => {
      const eligibility = await determineCourseDeletionEligibility(courseWithContentBlockId)
      expect(eligibility.eligible).toBe(false)
      expect(eligibility.reasons.length).toBeGreaterThan(0)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
