import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, User } from '../../db/models'
import { CourseValidationError } from '../services/errors'
import {
  archiveCourse,
  createCourse,
  createLesson,
  createModule,
  deleteLesson,
  deleteModule,
  getCourseByInternalName,
  getCourseOutline,
  getCoursePublishSummary,
  listCourses,
  publishCourse,
  reorderLessons,
  reorderModules,
  updateLessonBlocks,
} from '../services'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('course services integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleOneId: string
  let moduleTwoId: string
  let lessonOneId: string
  let lessonTwoId: string
  let foreignModuleId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const user = await User.create({
      fullName: 'Course Admin',
      email: `course-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })

    actorUserId = String(user._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `pharmaceutical-calculations-v1-${runId}`,
        title: 'Pharmaceutical Calculations',
        slug: `pharmaceutical-calculations-${runId}`,
        shortDescription: 'Learn pharmaceutical calculations step by step.',
        category: 'calculations',
        instructorId: actorUserId,
      },
      actorUserId,
    )

    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const moduleOne = await createModule(courseId, {
      title: 'Module 1',
      slug: 'module-1',
    })
    moduleOneId = String(moduleOne._id)

    const moduleTwo = await createModule(courseId, {
      title: 'Module 2',
      slug: 'module-2',
    })
    moduleTwoId = String(moduleTwo._id)

    const lessonOne = await createLesson(moduleOneId, {
      title: 'Lesson 1',
      slug: 'lesson-1',
      blocks: [
        {
          id: VALID_UUID,
          type: 'richText',
          order: 0,
          data: {
            format: 'markdown',
            content: 'Welcome to the course.',
          },
        },
      ],
    })
    lessonOneId = String(lessonOne._id)

    const lessonTwo = await createLesson(moduleTwoId, {
      title: 'Lesson 2',
      slug: 'lesson-2',
    })
    lessonTwoId = String(lessonTwo._id)

    const foreignCourse = await createCourse(
      {
        internalName: `foreign-course-${runId}`,
        title: 'Foreign Course',
        slug: `foreign-course-${runId}`,
        shortDescription: 'Foreign course for reorder validation.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    createdCourseIds.push(String(foreignCourse._id))

    const foreignModule = await createModule(String(foreignCourse._id), {
      title: 'Foreign Module',
      slug: 'foreign-module',
    })
    foreignModuleId = String(foreignModule._id)
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
    for (const id of createdCourseIds) {
      await Lesson.deleteMany({ courseId: id })
      await CourseModule.deleteMany({ courseId: id })
      await Course.findByIdAndDelete(id)
    }

    for (const id of createdUserIds) {
      await User.deleteOne({ _id: id })
    }

    await disconnectDb()
    await mongoose.connection.close()
  }, INTEGRATION_TIMEOUT_MS)

  it(
    'creates a course with stable internalName',
    async () => {
      const course = await getCourseByInternalName(`pharmaceutical-calculations-v1-${runId}`)

      expect(String(course._id)).toBe(courseId)
      expect(course.internalName).toBe(`pharmaceutical-calculations-v1-${runId}`)
      expect(course.moduleCount).toBe(2)
      expect(course.lessonCount).toBe(2)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'creates modules and lessons with expected outline counts',
    async () => {
      const outline = await getCourseOutline(courseId)

      expect(outline.modules).toHaveLength(2)
      expect(outline.modules[0]?.lessons).toHaveLength(1)
      expect(outline.modules[1]?.lessons).toHaveLength(1)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'updates lesson blocks with typed validation',
    async () => {
      const lesson = await updateLessonBlocks(lessonOneId, {
        blocks: [
          {
            id: VALID_UUID,
            type: 'callout',
            order: 0,
            data: {
              variant: 'tip',
              body: 'Practice daily.',
            },
          },
        ],
      })

      expect(lesson.blocks).toHaveLength(1)
      expect(lesson.blocks[0]?.type).toBe('callout')
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'reorders modules with scoped bulkWrite and persisted order values',
    async () => {
      const reorderedModules = await reorderModules(courseId, {
        orderedModuleIds: [moduleTwoId, moduleOneId],
      })

      expect(reorderedModules.map((module) => String(module._id))).toEqual([
        moduleTwoId,
        moduleOneId,
      ])
      expect(reorderedModules[0]?.order).toBe(100)
      expect(reorderedModules[1]?.order).toBe(200)

      const persistedModules = await CourseModule.find({ courseId }).sort({ order: 1 }).lean()
      expect(persistedModules.map((module) => String(module._id))).toEqual([
        moduleTwoId,
        moduleOneId,
      ])
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'reorders lessons with scoped bulkWrite and persisted order values',
    async () => {
      const extraLesson = await createLesson(moduleOneId, {
        title: 'Lesson 1b',
        slug: 'lesson-1b',
      })

      const reorderedLessons = await reorderLessons(moduleOneId, {
        orderedLessonIds: [String(extraLesson._id), lessonOneId],
      })

      expect(reorderedLessons.map((lesson) => String(lesson._id))).toEqual([
        String(extraLesson._id),
        lessonOneId,
      ])
      expect(reorderedLessons[0]?.order).toBe(100)
      expect(reorderedLessons[1]?.order).toBe(200)

      const persistedLessons = await Lesson.find({ moduleId: moduleOneId }).sort({ order: 1 }).lean()
      expect(persistedLessons.map((lesson) => String(lesson._id))).toEqual([
        String(extraLesson._id),
        lessonOneId,
      ])

      await deleteLesson(String(extraLesson._id))
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects duplicate module ids without partial mutation',
    async () => {
      const before = await CourseModule.find({ courseId }).sort({ order: 1 }).lean()

      await expect(
        reorderModules(courseId, {
          orderedModuleIds: [moduleTwoId, moduleTwoId],
        }),
      ).rejects.toThrow(CourseValidationError)

      const after = await CourseModule.find({ courseId }).sort({ order: 1 }).lean()
      expect(after.map((module) => [String(module._id), module.order])).toEqual(
        before.map((module) => [String(module._id), module.order]),
      )
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects module ids from another course',
    async () => {
      await expect(
        reorderModules(courseId, {
          orderedModuleIds: [moduleTwoId, foreignModuleId],
        }),
      ).rejects.toThrow(CourseValidationError)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects lesson ids from another module',
    async () => {
      await expect(
        reorderLessons(moduleOneId, {
          orderedLessonIds: [lessonTwoId],
        }),
      ).rejects.toThrow(CourseValidationError)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'reports publish blockers until required fields are present',
    async () => {
      const summary = await getCoursePublishSummary(courseId)

      expect(summary.canPublish).toBe(false)
      expect(summary.issues.length).toBeGreaterThan(0)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'lists courses for admin views',
    async () => {
      const courses = await listCourses({ status: 'draft' })
      expect(courses.some((course) => String(course._id) === courseId)).toBe(true)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'archives and publishes a course',
    async () => {
      const archived = await archiveCourse(courseId, actorUserId)
      expect(archived.status).toBe('archived')

      const published = await publishCourse(courseId, actorUserId)
      expect(published.status).toBe('published')
      expect(published.publishedAt).toBeTruthy()
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'cleans up lesson and module records',
    async () => {
      await deleteLesson(lessonOneId)
      await deleteLesson(lessonTwoId)
      await deleteModule(moduleOneId)
      await deleteModule(moduleTwoId)

      const outline = await getCourseOutline(courseId)
      expect(outline.modules).toHaveLength(0)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
