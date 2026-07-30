import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, User } from '../../db/models'
import { LESSON_ORDER_GAP } from '../constants'
import { createCourse } from '../services/course-service'
import { createModule } from '../services/module-service'
import { createLessonInModule, moveLessonInModule } from '../services/lesson-service'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('move lesson in module integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleId: string
  let lessonOneId: string
  let lessonTwoId: string
  let lessonThreeId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Move Lesson Admin',
      email: `move-lesson-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `move-lesson-v1-${runId}`,
        title: 'Move Lesson Course',
        slug: `move-lesson-${runId}`,
        shortDescription: 'Move lesson integration.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const courseModule = await createModule(courseId, {
      title: 'Move Module',
      slug: `move-module-${runId}`,
    })
    moduleId = String(courseModule._id)

    const lessonOne = await createLessonInModule(courseId, moduleId, {
      title: 'Lesson One',
      publicationStatus: 'draft',
    })
    lessonOneId = String(lessonOne._id)

    const lessonTwo = await createLessonInModule(courseId, moduleId, {
      title: 'Lesson Two',
      publicationStatus: 'draft',
    })
    lessonTwoId = String(lessonTwo._id)

    const lessonThree = await createLessonInModule(courseId, moduleId, {
      title: 'Lesson Three',
      publicationStatus: 'draft',
    })
    lessonThreeId = String(lessonThree._id)
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
    'moves a lesson down and normalizes order to 100/200/300',
    async () => {
      await moveLessonInModule(courseId, moduleId, lessonOneId, 'down')

      const lessons = await Lesson.find({ moduleId }).sort({ order: 1 }).lean()
      expect(lessons.map((lesson) => String(lesson._id))).toEqual([
        lessonTwoId,
        lessonOneId,
        lessonThreeId,
      ])
      expect(lessons.map((lesson) => lesson.order)).toEqual([
        LESSON_ORDER_GAP,
        LESSON_ORDER_GAP * 2,
        LESSON_ORDER_GAP * 3,
      ])
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'moves a lesson up',
    async () => {
      await moveLessonInModule(courseId, moduleId, lessonOneId, 'up')

      const lessons = await Lesson.find({ moduleId }).sort({ order: 1 }).lean()
      expect(lessons.map((lesson) => String(lesson._id))[0]).toBe(lessonOneId)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'no-ops at boundaries',
    async () => {
      const before = await Lesson.find({ moduleId }).sort({ order: 1 }).lean()
      await moveLessonInModule(courseId, moduleId, lessonOneId, 'up')
      const afterUp = await Lesson.find({ moduleId }).sort({ order: 1 }).lean()
      expect(afterUp.map((lesson) => lesson.order)).toEqual(before.map((lesson) => lesson.order))

      await moveLessonInModule(courseId, moduleId, lessonThreeId, 'down')
      const afterDown = await Lesson.find({ moduleId }).sort({ order: 1 }).lean()
      expect(afterDown.map((lesson) => lesson.order)).toEqual(before.map((lesson) => lesson.order))
    },
    INTEGRATION_TIMEOUT_MS,
  )
})

describeIfDb('move lesson in single-lesson module integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleId: string
  let lessonId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Single Lesson Move Admin',
      email: `single-move-lesson-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `single-move-lesson-v1-${runId}`,
        title: 'Single Move Lesson Course',
        slug: `single-move-lesson-${runId}`,
        shortDescription: 'Single lesson move integration.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const courseModule = await createModule(courseId, {
      title: 'Single Lesson Module',
      slug: `single-move-module-${runId}`,
    })
    moduleId = String(courseModule._id)

    const lesson = await createLessonInModule(courseId, moduleId, {
      title: 'Only Lesson',
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
    'does not change order when only one lesson exists',
    async () => {
      const before = await Lesson.findById(lessonId).lean()
      await moveLessonInModule(courseId, moduleId, lessonId, 'down')
      const after = await Lesson.findById(lessonId).lean()
      expect(after?.order).toBe(before?.order)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
