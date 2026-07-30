import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, User } from '../../db/models'
import { getAdminLessonEdit } from '../queries/admin-lesson-edit-query'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import {
  createLessonInModule,
  generateLessonSlug,
  updateLessonMetadata,
} from '../services/lesson-service'
import { LESSON_SLUG_FALLBACK } from '../services/lesson-slug'
import { LessonNotFoundError } from '../services/errors'
import { LESSON_ORDER_GAP } from '../constants'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('create lesson integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []
  const createdLessonIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Create Lesson Admin',
      email: `create-lesson-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `create-lesson-v1-${runId}`,
        title: 'Create Lesson Course',
        slug: `create-lesson-${runId}`,
        shortDescription: 'Create lesson integration.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const courseModule = await createModule(courseId, {
      title: 'Lesson Module',
      slug: `lesson-module-${runId}`,
    })
    moduleId = String(courseModule._id)
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
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
    'creates a draft lesson with generated slug, order, and increments lessonCount once',
    async () => {
      const beforeCourse = await Course.findById(courseId).lean()
      const beforeModule = await CourseModule.findById(moduleId).lean()

      const created = await createLessonInModule(courseId, moduleId, {
        title: 'Intro Lesson',
        description: 'First lesson',
        publicationStatus: 'draft',
      })

      createdLessonIds.push(String(created._id))

      const afterCourse = await Course.findById(courseId).lean()
      const afterModule = await CourseModule.findById(moduleId).lean()

      expect(created.title).toBe('Intro Lesson')
      expect(created.summary).toBe('First lesson')
      expect(created.status).toBe('draft')
      expect(created.slug).toBe('intro-lesson')
      expect(created.order).toBe(LESSON_ORDER_GAP)
      expect(afterModule?.lessonCount).toBe((beforeModule?.lessonCount ?? 0) + 1)
      expect(afterCourse?.lessonCount).toBe((beforeCourse?.lessonCount ?? 0) + 1)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'uses lesson fallback slug for Hebrew-only titles',
    async () => {
      const created = await createLessonInModule(courseId, moduleId, {
        title: 'שיעור ראשון',
        publicationStatus: 'draft',
      })

      createdLessonIds.push(String(created._id))
      expect(created.slug).toBe(LESSON_SLUG_FALLBACK)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'resolves duplicate generated slugs with suffixes',
    async () => {
      const firstSlug = await generateLessonSlug(courseId, 'Shared Title')
      const first = await createLessonInModule(courseId, moduleId, {
        title: 'Shared Title',
        publicationStatus: 'draft',
      })
      createdLessonIds.push(String(first._id))
      expect(first.slug).toBe(firstSlug)

      const secondSlug = await generateLessonSlug(courseId, 'Shared Title')
      expect(secondSlug).toBe(`${firstSlug}-2`)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})

describeIfDb('update lesson metadata integration', () => {
  let actorUserId: string
  let courseId: string
  let foreignCourseId: string
  let moduleId: string
  let foreignModuleId: string
  let lessonId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Update Lesson Admin',
      email: `update-lesson-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `update-lesson-v1-${runId}`,
        title: 'Update Lesson Course',
        slug: `update-lesson-${runId}`,
        shortDescription: 'Update lesson integration.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const foreignCourse = await createCourse(
      {
        internalName: `update-lesson-foreign-v1-${runId}`,
        title: 'Foreign Course',
        slug: `update-lesson-foreign-${runId}`,
        shortDescription: 'Foreign course.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    foreignCourseId = String(foreignCourse._id)
    createdCourseIds.push(foreignCourseId)

    const courseModule = await createModule(courseId, {
      title: 'Original Module',
      slug: `original-module-${runId}`,
    })
    moduleId = String(courseModule._id)

    const foreignModule = await createModule(foreignCourseId, {
      title: 'Foreign Module',
      slug: `foreign-module-${runId}`,
    })
    foreignModuleId = String(foreignModule._id)

    const lesson = await createLessonInModule(courseId, moduleId, {
      title: 'Original Lesson',
      description: 'Original description',
      publicationStatus: 'draft',
    })
    lessonId = String(lesson._id)
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
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
    'updates metadata without changing slug',
    async () => {
      const before = await Lesson.findById(lessonId).lean()

      const result = await updateLessonMetadata(courseId, moduleId, lessonId, {
        title: 'Updated Lesson Title',
        description: 'Updated description',
        publicationStatus: 'published',
      })

      expect(result.updated).toBe(true)
      expect(result.lesson.title).toBe('Updated Lesson Title')
      expect(result.lesson.status).toBe('published')
      expect(result.lesson.summary).toBe('Updated description')
      expect(result.lesson.slug).toBe(before?.slug)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'clears description and skips no-op writes',
    async () => {
      const cleared = await updateLessonMetadata(courseId, moduleId, lessonId, {
        title: 'Updated Lesson Title',
        publicationStatus: 'published',
      })

      expect(cleared.updated).toBe(true)
      expect(cleared.lesson.summary).toBeUndefined()

      const noOp = await updateLessonMetadata(courseId, moduleId, lessonId, {
        title: 'Updated Lesson Title',
        publicationStatus: 'published',
      })

      expect(noOp.updated).toBe(false)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects cross-module updates',
    async () => {
      await expect(
        updateLessonMetadata(foreignCourseId, foreignModuleId, lessonId, {
          title: 'Hacked',
          publicationStatus: 'draft',
        }),
      ).rejects.toBeInstanceOf(LessonNotFoundError)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'returns blockCount from edit query without exposing blocks payload',
    async () => {
      await Lesson.findByIdAndUpdate(lessonId, {
        $set: {
          blocks: [
            { id: 'block-1', type: 'richText', order: 0, data: { body: 'secret' } },
            { id: 'block-2', type: 'divider', order: 1, data: {} },
          ],
        },
      })

      const dto = await getAdminLessonEdit(courseId, moduleId, lessonId)

      expect(dto).not.toBeNull()
      expect(dto?.systemSettings.blockCount).toBe(2)
      expect('blocks' in (dto ?? {})).toBe(false)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
