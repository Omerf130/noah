import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, MediaAsset, User, VideoAsset } from '../../db/models'
import { archiveCourse, createCourse } from '../services/course-service'
import {
  deleteCoursePermanently,
  determineCourseDeletionEligibility,
} from '../services/course-deletion-service'
import {
  CourseArchiveNotAllowedError,
  CourseDeletionConfirmationError,
  CourseDeletionNotEligibleError,
} from '../services/errors'
import { createModule } from '../services/module-service'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('archive course integration', () => {
  let actorUserId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Archive Course Admin',
      email: `archive-course-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)
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
    'archives a draft course and preserves metadata',
    async () => {
      const created = await createCourse(
        {
          internalName: `archive-draft-v1-${runId}`,
          title: 'Archive Draft Course',
          slug: `archive-draft-${runId}`,
          shortDescription: 'Archive draft course.',
          category: 'calculations',
          pricing: { price: 0, currency: 'ILS' },
          visibility: 'private',
          instructorId: actorUserId,
        },
        actorUserId,
      )

      const courseId = String(created._id)
      createdCourseIds.push(courseId)

      const result = await archiveCourse(courseId, actorUserId)

      expect(result.archived).toBe(true)
      expect(result.course.status).toBe('archived')
      expect(result.course.archivedAt).toBeTruthy()
      expect(String(result.course.updatedBy)).toBe(actorUserId)
      expect(result.course.title).toBe('Archive Draft Course')
      expect(result.course.slug).toBe(`archive-draft-${runId}`)
      expect(result.course.internalName).toBe(`archive-draft-v1-${runId}`)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects archive for published courses',
    async () => {
      const created = await createCourse(
        {
          internalName: `archive-published-v1-${runId}`,
          title: 'Archive Published Course',
          slug: `archive-published-${runId}`,
          shortDescription: 'Published course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )

      const courseId = String(created._id)
      createdCourseIds.push(courseId)

      await Course.findByIdAndUpdate(courseId, { status: 'published' })

      await expect(archiveCourse(courseId, actorUserId)).rejects.toBeInstanceOf(
        CourseArchiveNotAllowedError,
      )
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects archive for already archived courses',
    async () => {
      const created = await createCourse(
        {
          internalName: `archive-already-v1-${runId}`,
          title: 'Already Archived Course',
          slug: `archive-already-${runId}`,
          shortDescription: 'Already archived course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )

      const courseId = String(created._id)
      createdCourseIds.push(courseId)

      await archiveCourse(courseId, actorUserId)

      await expect(archiveCourse(courseId, actorUserId)).rejects.toBeInstanceOf(
        CourseArchiveNotAllowedError,
      )
    },
    INTEGRATION_TIMEOUT_MS,
  )
})

describeIfDb('course deletion service integration', () => {
  let actorUserId: string
  const createdCourseIds: string[] = []
  const createdModuleIds: string[] = []
  const createdLessonIds: string[] = []
  const createdAssetIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Delete Course Admin',
      email: `delete-course-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
    for (const id of createdLessonIds) {
      await Lesson.deleteOne({ _id: id })
    }

    for (const id of createdModuleIds) {
      await CourseModule.deleteOne({ _id: id })
    }

    for (const id of createdCourseIds) {
      await Course.findByIdAndDelete(id)
    }

    for (const id of createdAssetIds) {
      await MediaAsset.deleteOne({ _id: id })
      await VideoAsset.deleteOne({ _id: id })
    }

    for (const id of createdUserIds) {
      await User.deleteOne({ _id: id })
    }

    await disconnectDb()
    await mongoose.connection.close()
  }, INTEGRATION_TIMEOUT_MS)

  it(
    'marks an empty draft course as eligible',
    async () => {
      const created = await createCourse(
        {
          internalName: `delete-empty-v1-${runId}`,
          title: 'Delete Empty Course',
          slug: `delete-empty-${runId}`,
          shortDescription: 'Empty draft course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )

      const courseId = String(created._id)
      createdCourseIds.push(courseId)

      const eligibility = await determineCourseDeletionEligibility(courseId)

      expect(eligibility.eligible).toBe(true)
      expect(eligibility.reasons).toEqual([])
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'deletes an eligible draft course exactly once',
    async () => {
      const created = await createCourse(
        {
          internalName: `delete-success-v1-${runId}`,
          title: 'Delete Success Course',
          slug: `delete-success-${runId}`,
          shortDescription: 'Delete success course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )

      const courseId = String(created._id)

      const result = await deleteCoursePermanently(courseId, actorUserId, 'Delete Success Course')

      expect(result.deleted).toBe(true)
      expect(result.courseId).toBe(courseId)

      const remaining = await Course.findById(courseId).lean()
      expect(remaining).toBeNull()
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects wrong confirmation titles',
    async () => {
      const created = await createCourse(
        {
          internalName: `delete-title-v1-${runId}`,
          title: 'Exact Title Course',
          slug: `delete-title-${runId}`,
          shortDescription: 'Title validation course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )

      const courseId = String(created._id)
      createdCourseIds.push(courseId)

      await expect(
        deleteCoursePermanently(courseId, actorUserId, 'Wrong Title'),
      ).rejects.toBeInstanceOf(CourseDeletionConfirmationError)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects published and archived courses',
    async () => {
      const published = await createCourse(
        {
          internalName: `delete-published-v1-${runId}`,
          title: 'Published Delete Course',
          slug: `delete-published-${runId}`,
          shortDescription: 'Published delete course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )
      const publishedId = String(published._id)
      createdCourseIds.push(publishedId)
      await Course.findByIdAndUpdate(publishedId, { status: 'published' })

      const archived = await createCourse(
        {
          internalName: `delete-archived-v1-${runId}`,
          title: 'Archived Delete Course',
          slug: `delete-archived-${runId}`,
          shortDescription: 'Archived delete course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )
      const archivedId = String(archived._id)
      createdCourseIds.push(archivedId)
      await archiveCourse(archivedId, actorUserId)

      expect((await determineCourseDeletionEligibility(publishedId)).eligible).toBe(false)
      expect((await determineCourseDeletionEligibility(archivedId)).eligible).toBe(false)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'blocks deletion when modules exist even if counts are stale',
    async () => {
      const created = await createCourse(
        {
          internalName: `delete-module-v1-${runId}`,
          title: 'Module Block Course',
          slug: `delete-module-${runId}`,
          shortDescription: 'Module block course.',
          instructorId: actorUserId,
        },
        actorUserId,
      )

      const courseId = String(created._id)
      createdCourseIds.push(courseId)

      const courseModule = await createModule(courseId, {
        title: 'Module One',
        slug: `module-one-${runId}`,
      })
      createdModuleIds.push(String(courseModule._id))

      await Course.findByIdAndUpdate(courseId, { moduleCount: 0, lessonCount: 0 })

      const eligibility = await determineCourseDeletionEligibility(courseId)

      expect(eligibility.eligible).toBe(false)

      await expect(
        deleteCoursePermanently(courseId, actorUserId, 'Module Block Course'),
      ).rejects.toBeInstanceOf(CourseDeletionNotEligibleError)

      expect(await CourseModule.exists({ courseId })).toBeTruthy()
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'blocks deletion when lessons or asset references exist',
    async () => {
      const mediaAsset = await MediaAsset.create({
        kind: 'image',
        storageProvider: 'local',
        storageKey: `media-${runId}`,
        originalFilename: 'cover.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 100,
        uploadedBy: actorUserId,
      })
      createdAssetIds.push(String(mediaAsset._id))

      const videoAsset = await VideoAsset.create({
        title: 'Lesson Video',
        provider: 'pending',
        status: 'uploading',
        uploadedBy: actorUserId,
      })
      createdAssetIds.push(String(videoAsset._id))

      const created = await createCourse(
        {
          internalName: `delete-assets-v1-${runId}`,
          title: 'Asset Block Course',
          slug: `delete-assets-${runId}`,
          shortDescription: 'Asset block course.',
          instructorId: actorUserId,
          thumbnailAssetId: String(mediaAsset._id),
        },
        actorUserId,
      )

      const courseId = String(created._id)
      createdCourseIds.push(courseId)

      const courseModule = await createModule(courseId, {
        title: 'Asset Module',
        slug: `asset-module-${runId}`,
      })
      createdModuleIds.push(String(courseModule._id))

      const lesson = await Lesson.create({
        courseId,
        moduleId: courseModule._id,
        title: 'Asset Lesson',
        slug: `asset-lesson-${runId}`,
        order: 10,
        blocks: [
          {
            id: '11111111-1111-4111-8111-111111111111',
            type: 'video',
            order: 0,
            data: { videoAssetId: String(videoAsset._id) },
          },
          {
            id: '22222222-2222-4222-8222-222222222222',
            type: 'file',
            order: 1,
            data: {
              mediaAssetId: String(mediaAsset._id),
              label: 'Worksheet',
              allowDownload: true,
            },
          },
        ],
      })
      createdLessonIds.push(String(lesson._id))

      const eligibility = await determineCourseDeletionEligibility(courseId)

      expect(eligibility.eligible).toBe(false)
      expect(eligibility.reasons.length).toBeGreaterThan(0)

      await expect(
        deleteCoursePermanently(courseId, actorUserId, 'Asset Block Course'),
      ).rejects.toBeInstanceOf(CourseDeletionNotEligibleError)

      expect(await Course.findById(courseId)).toBeTruthy()
      expect(await Lesson.exists({ courseId })).toBeTruthy()
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
