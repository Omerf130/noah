import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, User } from '../../db/models'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import { createLessonInModule } from '../services/lesson-service'
import { mongoSupportsTransactions } from '../services/transaction-utils'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('lesson create transaction integration', () => {
  let supportsTransactions = false
  let actorUserId: string
  let courseId: string
  let moduleId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()
    supportsTransactions = await mongoSupportsTransactions()

    const actor = await User.create({
      fullName: 'Transaction Lesson Admin',
      email: `txn-lesson-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `txn-lesson-v1-${runId}`,
        title: 'Transaction Lesson Course',
        slug: `txn-lesson-${runId}`,
        shortDescription: 'Transaction lesson integration.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const courseModule = await createModule(courseId, {
      title: 'Transaction Module',
      slug: `txn-module-${runId}`,
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
    'creates lesson and increments module and course lessonCount atomically',
    async (ctx) => {
      if (!supportsTransactions) {
        ctx.skip()
        return
      }

      const beforeCourse = await Course.findById(courseId).lean()
      const beforeModule = await CourseModule.findById(moduleId).lean()

      const created = await createLessonInModule(courseId, moduleId, {
        title: 'Transactional Lesson',
        publicationStatus: 'draft',
      })

      const afterCourse = await Course.findById(courseId).lean()
      const afterModule = await CourseModule.findById(moduleId).lean()
      const persistedLesson = await Lesson.findById(created._id).lean()

      expect(persistedLesson).not.toBeNull()
      expect(afterModule?.lessonCount).toBe((beforeModule?.lessonCount ?? 0) + 1)
      expect(afterCourse?.lessonCount).toBe((beforeCourse?.lessonCount ?? 0) + 1)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
