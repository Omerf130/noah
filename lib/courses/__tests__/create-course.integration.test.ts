import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, User } from '../../db/models'
import { listAdminCourses } from '../queries/admin-course-list-query'
import {
  CourseInstructorError,
  CourseValidationError,
} from '../services/errors'
import { createCourse } from '../services/course-service'
import { validateCourseInstructor } from '../services/instructor-service'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('create course integration', () => {
  let actorUserId: string
  let inactiveAdminId: string
  let studentUserId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Create Course Admin',
      email: `create-course-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const inactiveAdmin = await User.create({
      fullName: 'Inactive Admin',
      email: `inactive-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: false,
    })
    inactiveAdminId = String(inactiveAdmin._id)
    createdUserIds.push(inactiveAdminId)

    const student = await User.create({
      fullName: 'Create Course Student',
      email: `create-course-student-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'student',
      isActive: true,
    })
    studentUserId = String(student._id)
    createdUserIds.push(studentUserId)
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
    'creates a draft course with trusted audit fields',
    async () => {
      const internalName = `create-course-v1-${runId}`
      const slug = `create-course-${runId}`

      const course = await createCourse(
        {
          internalName,
          title: 'Create Course Test',
          slug,
          shortDescription: 'Draft course shell only.',
          category: 'calculations',
          pricing: { price: 0, currency: 'ILS' },
          visibility: 'private',
          instructorId: actorUserId,
        },
        actorUserId,
      )

      createdCourseIds.push(String(course._id))

      expect(course.status).toBe('draft')
      expect(course.visibility).toBe('private')
      expect(String(course.createdBy)).toBe(actorUserId)
      expect(String(course.updatedBy)).toBe(actorUserId)
      expect(String(course.instructorId)).toBe(actorUserId)
      expect(course.moduleCount).toBe(0)
      expect(course.lessonCount).toBe(0)

      const modules = await CourseModule.countDocuments({ courseId: course._id })
      const lessons = await Lesson.countDocuments({ courseId: course._id })

      expect(modules).toBe(0)
      expect(lessons).toBe(0)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'forces draft status even when client sends published',
    async () => {
      const course = await createCourse(
        {
          internalName: `published-attempt-${runId}`,
          title: 'Published Attempt',
          slug: `published-attempt-${runId}`,
          shortDescription: 'Should remain draft.',
          instructorId: actorUserId,
          status: 'published',
        },
        actorUserId,
      )

      createdCourseIds.push(String(course._id))
      expect(course.status).toBe('draft')
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'returns duplicate internalName field errors from E11000',
    async () => {
      const internalName = `duplicate-internal-${runId}`

      const first = await createCourse(
        {
          internalName,
          title: 'First Course',
          slug: `first-${runId}`,
          shortDescription: 'First course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )
      createdCourseIds.push(String(first._id))

      await expect(
        createCourse(
          {
            internalName,
            title: 'Second Course',
            slug: `second-${runId}`,
            shortDescription: 'Second course.',
            instructorId: actorUserId,
          },
          actorUserId,
        ),
      ).rejects.toMatchObject({
        name: 'CourseDuplicateKeyError',
        field: 'internalName',
      })
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'returns duplicate slug field errors from E11000',
    async () => {
      const slug = `duplicate-slug-${runId}`

      const first = await createCourse(
        {
          internalName: `slug-first-${runId}`,
          title: 'Slug First',
          slug,
          shortDescription: 'First slug course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )
      createdCourseIds.push(String(first._id))

      await expect(
        createCourse(
          {
            internalName: `slug-second-${runId}`,
            title: 'Slug Second',
            slug,
            shortDescription: 'Second slug course.',
            instructorId: actorUserId,
          },
          actorUserId,
        ),
      ).rejects.toMatchObject({
        name: 'CourseDuplicateKeyError',
        field: 'slug',
      })
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects invalid and inactive instructors',
    async () => {
      await expect(validateCourseInstructor(studentUserId)).rejects.toBeInstanceOf(
        CourseInstructorError,
      )

      await expect(validateCourseInstructor(inactiveAdminId)).rejects.toMatchObject({
        reason: 'inactive',
      })

      await expect(
        createCourse(
          {
            internalName: `invalid-instructor-${runId}`,
            title: 'Invalid Instructor',
            slug: `invalid-instructor-${runId}`,
            shortDescription: 'Should fail.',
            instructorId: studentUserId,
          },
          actorUserId,
        ),
      ).rejects.toBeInstanceOf(CourseInstructorError)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects invalid pricing through the domain validator',
    async () => {
      await expect(
        createCourse(
          {
            internalName: `invalid-pricing-${runId}`,
            title: 'Invalid Pricing',
            slug: `invalid-pricing-${runId}`,
            shortDescription: 'Should fail.',
            instructorId: actorUserId,
            pricing: { price: 100, salePrice: 120, currency: 'ILS' },
          },
          actorUserId,
        ),
      ).rejects.toBeInstanceOf(CourseValidationError)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'includes newly created courses in the admin list query',
    async () => {
      const internalName = `admin-list-${runId}`
      const slug = `admin-list-${runId}`

      const course = await createCourse(
        {
          internalName,
          title: 'Admin List Course',
          slug,
          shortDescription: 'Should appear in admin list.',
          instructorId: actorUserId,
        },
        actorUserId,
      )
      createdCourseIds.push(String(course._id))

      const result = await listAdminCourses({
        q: slug,
        page: 1,
        sort: 'updated-desc',
      })

      expect(result.items.some((item) => item.slug === slug)).toBe(true)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
