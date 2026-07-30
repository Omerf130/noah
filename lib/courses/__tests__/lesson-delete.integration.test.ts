import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, User } from '../../db/models'
import { LESSON_ORDER_GAP } from '../constants'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import {
  createLessonInModule,
  deleteLessonFromModule,
} from '../services/lesson-service'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const BLOCKS_MESSAGE =
  'לא ניתן למחוק את השיעור משום שקיימים בו בלוקי תוכן. יש להסיר את התוכן תחילה.'

describeIfDb('delete lesson from module integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleId: string
  let emptyLessonId: string
  let blockedLessonId: string
  let middleLessonId: string
  let lastLessonId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Delete Lesson Admin',
      email: `delete-lesson-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `delete-lesson-v1-${runId}`,
        title: 'Delete Lesson Course',
        slug: `delete-lesson-${runId}`,
        shortDescription: 'Delete lesson integration.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const courseModule = await createModule(courseId, {
      title: 'Delete Module',
      slug: `delete-module-${runId}`,
    })
    moduleId = String(courseModule._id)

    const first = await createLessonInModule(courseId, moduleId, {
      title: 'First Lesson',
      publicationStatus: 'draft',
    })
    middleLessonId = String(first._id)

    const middle = await createLessonInModule(courseId, moduleId, {
      title: 'Middle Lesson',
      publicationStatus: 'draft',
    })
    emptyLessonId = String(middle._id)

    const last = await createLessonInModule(courseId, moduleId, {
      title: 'Last Lesson',
      publicationStatus: 'draft',
    })
    lastLessonId = String(last._id)

    const blocked = await createLessonInModule(courseId, moduleId, {
      title: 'Blocked Lesson',
      publicationStatus: 'draft',
    })
    blockedLessonId = String(blocked._id)

    await Lesson.findByIdAndUpdate(blockedLessonId, {
      $set: {
        blocks: [{ id: 'block-1', type: 'richText', order: 0, data: { body: 'content' } }],
      },
    })
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
    'rejects deleting a lesson with blocks',
    async () => {
      await expect(
        deleteLessonFromModule(courseId, moduleId, blockedLessonId),
      ).rejects.toThrow(BLOCKS_MESSAGE)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'deletes an empty lesson, decrements counts, and normalizes remaining order',
    async () => {
      const beforeCourse = await Course.findById(courseId).lean()
      const beforeModule = await CourseModule.findById(moduleId).lean()

      await deleteLessonFromModule(courseId, moduleId, emptyLessonId)

      const afterCourse = await Course.findById(courseId).lean()
      const afterModule = await CourseModule.findById(moduleId).lean()
      const remaining = await Lesson.find({ moduleId }).sort({ order: 1 }).lean()

      expect(await Lesson.findById(emptyLessonId)).toBeNull()
      expect(afterModule?.lessonCount).toBe((beforeModule?.lessonCount ?? 0) - 1)
      expect(afterCourse?.lessonCount).toBe((beforeCourse?.lessonCount ?? 0) - 1)
      expect(remaining.map((lesson) => lesson.order)).toEqual([
        LESSON_ORDER_GAP,
        LESSON_ORDER_GAP * 2,
        LESSON_ORDER_GAP * 3,
      ])
      expect(remaining.map((lesson) => String(lesson._id))).toEqual([
        middleLessonId,
        lastLessonId,
        blockedLessonId,
      ])
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
