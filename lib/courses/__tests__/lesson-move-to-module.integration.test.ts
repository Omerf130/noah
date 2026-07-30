import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, User } from '../../db/models'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import {
  createLessonInModule,
  moveLessonToModule,
} from '../services/lesson-service'
import { CourseModuleNotFoundError, CourseValidationError } from '../services/errors'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('move lesson to module integration', () => {
  let actorUserId: string
  let courseId: string
  let foreignCourseId: string
  let sourceModuleId: string
  let targetModuleId: string
  let foreignModuleId: string
  let lessonId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Move Lesson Module Admin',
      email: `move-lesson-module-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `move-lesson-module-v1-${runId}`,
        title: 'Move Lesson Module Course',
        slug: `move-lesson-module-${runId}`,
        shortDescription: 'Move lesson to module integration.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const foreignCourse = await createCourse(
      {
        internalName: `move-lesson-module-foreign-v1-${runId}`,
        title: 'Foreign Course',
        slug: `move-lesson-module-foreign-${runId}`,
        shortDescription: 'Foreign course.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    foreignCourseId = String(foreignCourse._id)
    createdCourseIds.push(foreignCourseId)

    const sourceModule = await createModule(courseId, {
      title: 'Source Module',
      slug: `source-module-${runId}`,
    })
    sourceModuleId = String(sourceModule._id)

    const targetModule = await createModule(courseId, {
      title: 'Target Module',
      slug: `target-module-${runId}`,
    })
    targetModuleId = String(targetModule._id)

    const foreignModule = await createModule(foreignCourseId, {
      title: 'Foreign Module',
      slug: `foreign-module-${runId}`,
    })
    foreignModuleId = String(foreignModule._id)

    const lesson = await createLessonInModule(courseId, sourceModuleId, {
      title: 'Moving Lesson',
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
    'moves a lesson to another module and updates module counts while keeping course count unchanged',
    async () => {
      const beforeCourse = await Course.findById(courseId).lean()
      const beforeSource = await CourseModule.findById(sourceModuleId).lean()
      const beforeTarget = await CourseModule.findById(targetModuleId).lean()

      await moveLessonToModule(courseId, lessonId, targetModuleId)

      const afterCourse = await Course.findById(courseId).lean()
      const afterSource = await CourseModule.findById(sourceModuleId).lean()
      const afterTarget = await CourseModule.findById(targetModuleId).lean()
      const movedLesson = await Lesson.findById(lessonId).lean()

      expect(String(movedLesson?.moduleId)).toBe(targetModuleId)
      expect(afterSource?.lessonCount).toBe((beforeSource?.lessonCount ?? 0) - 1)
      expect(afterTarget?.lessonCount).toBe((beforeTarget?.lessonCount ?? 0) + 1)
      expect(afterCourse?.lessonCount).toBe(beforeCourse?.lessonCount)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects moving into the same module',
    async () => {
      await expect(moveLessonToModule(courseId, lessonId, targetModuleId)).rejects.toBeInstanceOf(
        CourseValidationError,
      )
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects cross-course target module',
    async () => {
      await expect(
        moveLessonToModule(courseId, lessonId, foreignModuleId),
      ).rejects.toBeInstanceOf(CourseModuleNotFoundError)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
