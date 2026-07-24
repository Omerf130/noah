import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, User } from '../../db/models'
import { getAdminCourseDetails } from '../queries/admin-course-details-query'
import { createCourse, updateCourseMetadata } from '../services/course-service'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('update course metadata integration', () => {
  let actorUserId: string
  let secondAdminId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Update Course Admin',
      email: `update-course-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const secondAdmin = await User.create({
      fullName: 'Second Update Admin',
      email: `second-update-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    secondAdminId = String(secondAdmin._id)
    createdUserIds.push(secondAdminId)
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
    'updates metadata, keeps internalName immutable, and updates audit timestamps correctly',
    async () => {
      const internalName = `update-metadata-v1-${runId}`
      const originalSlug = `update-metadata-${runId}`
      const newSlug = `updated-metadata-${runId}`

      const created = await createCourse(
        {
          internalName,
          title: 'Original Title',
          slug: originalSlug,
          shortDescription: 'Original description.',
          category: 'calculations',
          pricing: { price: 0, currency: 'ILS' },
          visibility: 'private',
          instructorId: actorUserId,
        },
        actorUserId,
      )

      const courseId = String(created._id)
      createdCourseIds.push(courseId)

      const createdAt = created.createdAt
      const originalUpdatedAt = created.updatedAt

      await new Promise((resolve) => setTimeout(resolve, 20))

      const result = await updateCourseMetadata(
        courseId,
        {
          title: 'Updated Title',
          slug: newSlug,
          shortDescription: 'Updated description.',
          category: 'pharmacology',
          pricing: { price: 150, salePrice: 120, currency: 'ILS' },
          visibility: 'members',
          featured: true,
          estimatedDurationMinutes: 120,
          difficulty: 'intermediate',
          instructorId: secondAdminId,
        },
        secondAdminId,
      )

      expect(result.updated).toBe(true)
      expect(result.course.title).toBe('Updated Title')
      expect(result.course.slug).toBe(newSlug)
      expect(result.course.internalName).toBe(internalName)
      expect(String(result.course.createdBy)).toBe(actorUserId)
      expect(String(result.course.updatedBy)).toBe(secondAdminId)
      expect(result.course.status).toBe('draft')
      expect(result.course.moduleCount).toBe(0)
      expect(result.course.lessonCount).toBe(0)
      expect(result.course.createdAt?.getTime()).toBe(createdAt?.getTime())
      expect(result.course.updatedAt?.getTime()).toBeGreaterThan(originalUpdatedAt?.getTime() ?? 0)

      const details = await getAdminCourseDetails(courseId)
      expect(details?.title).toBe('Updated Title')
      expect(details?.slug).toBe(newSlug)
      expect(details?.internalName).toBe(internalName)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'returns updated false without changing updatedAt when metadata is identical',
    async () => {
      const internalName = `update-noop-v1-${runId}`
      const slug = `update-noop-${runId}`

      const created = await createCourse(
        {
          internalName,
          title: 'No-op Course',
          slug,
          shortDescription: 'No-op description.',
          category: 'calculations',
          pricing: { price: 0, currency: 'ILS' },
          visibility: 'private',
          instructorId: actorUserId,
        },
        actorUserId,
      )

      const courseId = String(created._id)
      createdCourseIds.push(courseId)

      const before = await Course.findById(courseId).lean()
      const updatedAtBefore = before?.updatedAt

      const result = await updateCourseMetadata(
        courseId,
        {
          title: 'No-op Course',
          slug,
          shortDescription: 'No-op description.',
          category: 'calculations',
          pricing: { price: 0, currency: 'ILS' },
          visibility: 'private',
          featured: false,
          instructorId: actorUserId,
        },
        actorUserId,
      )

      expect(result.updated).toBe(false)

      const after = await Course.findById(courseId).lean()
      expect(after?.updatedAt?.getTime()).toBe(updatedAtBefore?.getTime())
      expect(after?.internalName).toBe(internalName)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'returns duplicate slug errors from E11000',
    async () => {
      const firstSlug = `duplicate-update-first-${runId}`
      const secondSlug = `duplicate-update-second-${runId}`

      const first = await createCourse(
        {
          internalName: `duplicate-update-first-v1-${runId}`,
          title: 'First Update Course',
          slug: firstSlug,
          shortDescription: 'First course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )
      createdCourseIds.push(String(first._id))

      const second = await createCourse(
        {
          internalName: `duplicate-update-second-v1-${runId}`,
          title: 'Second Update Course',
          slug: secondSlug,
          shortDescription: 'Second course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )
      createdCourseIds.push(String(second._id))

      await expect(
        updateCourseMetadata(
          String(second._id),
          {
            title: 'Second Update Course',
            slug: firstSlug,
            shortDescription: 'Second course.',
            category: 'calculations',
            pricing: { price: 0, currency: 'ILS' },
            visibility: 'private',
            featured: false,
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
})
