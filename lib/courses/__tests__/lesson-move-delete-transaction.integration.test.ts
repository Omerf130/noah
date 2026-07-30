import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, User } from '../../db/models'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import {
  createLessonInModule,
  deleteLessonFromModule,
  moveLessonToModule,
} from '../services/lesson-service'
import { mongoSupportsTransactions } from '../services/transaction-utils'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('lesson move and delete transaction integration', () => {
  let supportsTransactions = false
  let actorUserId: string
  let courseId: string
  let sourceModuleId: string
  let targetModuleId: string
  let moveLessonId: string
  let deleteLessonId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()
    supportsTransactions = await mongoSupportsTransactions()

    const actor = await User.create({
      fullName: 'Txn Lesson Admin',
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
        title: 'Txn Lesson Course',
        slug: `txn-lesson-${runId}`,
        shortDescription: 'Transaction lesson integration.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const sourceModule = await createModule(courseId, {
      title: 'Txn Source Module',
      slug: `txn-source-${runId}`,
    })
    sourceModuleId = String(sourceModule._id)

    const targetModule = await createModule(courseId, {
      title: 'Txn Target Module',
      slug: `txn-target-${runId}`,
    })
    targetModuleId = String(targetModule._id)

    const moveLesson = await createLessonInModule(courseId, sourceModuleId, {
      title: 'Txn Move Lesson',
      publicationStatus: 'draft',
    })
    moveLessonId = String(moveLesson._id)

    const deleteLesson = await createLessonInModule(courseId, sourceModuleId, {
      title: 'Txn Delete Lesson',
      publicationStatus: 'draft',
    })
    deleteLessonId = String(deleteLesson._id)
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
    'move-to-module and delete run atomically with count sync when transactions are supported',
    async (ctx) => {
      if (!supportsTransactions) {
        ctx.skip()
        return
      }

      const beforeMoveCourse = await Course.findById(courseId).lean()
      const beforeMoveSource = await CourseModule.findById(sourceModuleId).lean()
      const beforeMoveTarget = await CourseModule.findById(targetModuleId).lean()

      await moveLessonToModule(courseId, moveLessonId, targetModuleId)

      const afterMoveCourse = await Course.findById(courseId).lean()
      const afterMoveSource = await CourseModule.findById(sourceModuleId).lean()
      const afterMoveTarget = await CourseModule.findById(targetModuleId).lean()

      expect(afterMoveSource?.lessonCount).toBe((beforeMoveSource?.lessonCount ?? 0) - 1)
      expect(afterMoveTarget?.lessonCount).toBe((beforeMoveTarget?.lessonCount ?? 0) + 1)
      expect(afterMoveCourse?.lessonCount).toBe(beforeMoveCourse?.lessonCount)

      const beforeDeleteCourse = await Course.findById(courseId).lean()
      const beforeDeleteModule = await CourseModule.findById(sourceModuleId).lean()

      await deleteLessonFromModule(courseId, sourceModuleId, deleteLessonId)

      const afterDeleteCourse = await Course.findById(courseId).lean()
      const afterDeleteModule = await CourseModule.findById(sourceModuleId).lean()

      expect(await Lesson.findById(deleteLessonId)).toBeNull()
      expect(afterDeleteModule?.lessonCount).toBe((beforeDeleteModule?.lessonCount ?? 0) - 1)
      expect(afterDeleteCourse?.lessonCount).toBe((beforeDeleteCourse?.lessonCount ?? 0) - 1)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
