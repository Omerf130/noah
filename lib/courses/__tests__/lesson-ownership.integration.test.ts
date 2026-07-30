import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, User } from '../../db/models'
import { listAdminModuleLessons } from '../queries/admin-lesson-list-query'
import { getAdminModuleLessonContext } from '../queries/admin-module-lesson-context-query'
import { assertLessonBelongsToModule } from '../services/lesson-service'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import { createLesson } from '../services/lesson-service'
import { LessonNotFoundError, CourseModuleNotFoundError } from '../services/errors'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('lesson ownership and list query integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleId: string
  let foreignCourseId: string
  let foreignModuleId: string
  let lessonId: string
  let foreignLessonId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []
  const createdLessonIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Lesson F1 Admin',
      email: `lesson-f1-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `lesson-f1-v1-${runId}`,
        title: 'Lesson F1 Course',
        slug: `lesson-f1-${runId}`,
        shortDescription: 'Lesson list tests.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const foreignCourse = await createCourse(
      {
        internalName: `lesson-f1-foreign-v1-${runId}`,
        title: 'Foreign Course',
        slug: `lesson-f1-foreign-${runId}`,
        shortDescription: 'Foreign course.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    foreignCourseId = String(foreignCourse._id)
    createdCourseIds.push(foreignCourseId)

    const courseModule = await createModule(courseId, {
      title: 'Module With Lessons',
      slug: `module-lessons-${runId}`,
    })
    moduleId = String(courseModule._id)

    const foreignModule = await createModule(foreignCourseId, {
      title: 'Foreign Module',
      slug: `foreign-module-${runId}`,
    })
    foreignModuleId = String(foreignModule._id)

    const lesson = await createLesson(moduleId, {
      title: 'Lesson One',
      slug: `lesson-one-${runId}`,
      status: 'published',
      summary: 'Summary text',
    })
    lessonId = String(lesson._id)
    createdLessonIds.push(lessonId)

    const foreignLesson = await createLesson(foreignModuleId, {
      title: 'Foreign Lesson',
      slug: `foreign-lesson-${runId}`,
    })
    foreignLessonId = String(foreignLesson._id)
    createdLessonIds.push(foreignLessonId)
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
    if (createdLessonIds.length > 0) {
      await Lesson.deleteMany({ _id: { $in: createdLessonIds } })
    }

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
    'assertLessonBelongsToModule accepts matching lesson scope',
    async () => {
      const lesson = await assertLessonBelongsToModule(courseId, moduleId, lessonId)
      expect(String(lesson._id)).toBe(lessonId)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'assertLessonBelongsToModule rejects cross-course and cross-module access',
    async () => {
      await expect(
        assertLessonBelongsToModule(foreignCourseId, moduleId, lessonId),
      ).rejects.toBeInstanceOf(CourseModuleNotFoundError)

      await expect(
        assertLessonBelongsToModule(courseId, foreignModuleId, lessonId),
      ).rejects.toBeInstanceOf(CourseModuleNotFoundError)

      await expect(
        assertLessonBelongsToModule(courseId, moduleId, foreignLessonId),
      ).rejects.toBeInstanceOf(LessonNotFoundError)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'listAdminModuleLessons returns only lessons from the validated module',
    async () => {
      const result = await listAdminModuleLessons(courseId, moduleId)

      expect(result).not.toBeNull()
      expect(result?.totalItems).toBe(1)
      expect(result?.items[0]?.id).toBe(lessonId)
      expect(result?.items[0]?.publicationStatus).toBe('published')
      expect(result?.items[0]?.description).toBe('Summary text')
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'listAdminModuleLessons returns null for invalid or cross-course module ids',
    async () => {
      expect(await listAdminModuleLessons('bad-id', moduleId)).toBeNull()
      expect(await listAdminModuleLessons(courseId, 'bad-id')).toBeNull()
      expect(await listAdminModuleLessons(courseId, foreignModuleId)).toBeNull()
      expect(await listAdminModuleLessons(foreignCourseId, moduleId)).toBeNull()
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'getAdminModuleLessonContext rejects cross-course module pairing',
    async () => {
      expect(await getAdminModuleLessonContext(courseId, moduleId)).not.toBeNull()
      expect(await getAdminModuleLessonContext(foreignCourseId, moduleId)).toBeNull()
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
