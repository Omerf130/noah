import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, User } from '../../db/models'
import { createCourse } from '../services/course-service'
import {
  createModule,
  generateModuleSlug,
  updateModuleMetadata,
} from '../services/module-service'
import { CourseModuleNotFoundError } from '../services/errors'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('create module integration', () => {
  let actorUserId: string
  let courseId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Create Module Admin',
      email: `create-module-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `create-module-v1-${runId}`,
        title: 'Create Module Course',
        slug: `create-module-${runId}`,
        shortDescription: 'Create module integration.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
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
    'creates a draft module with generated slug, order, and increments moduleCount once',
    async () => {
      const before = await Course.findById(courseId).lean()

      const created = await createModule(courseId, {
        title: 'Intro Module',
      })

      const after = await Course.findById(courseId).lean()

      expect(created.publicationStatus).toBe('draft')
      expect(created.lessonCount).toBe(0)
      expect(created.slug).toBe('intro-module')
      expect(created.order).toBe(100)
      expect(after?.moduleCount).toBe((before?.moduleCount ?? 0) + 1)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'creates a published module when publicationStatus is provided',
    async () => {
      const created = await createModule(courseId, {
        title: 'Published Module',
        publicationStatus: 'published',
      })

      expect(created.publicationStatus).toBe('published')
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'resolves duplicate generated slugs with suffixes',
    async () => {
      const firstSlug = await generateModuleSlug(courseId, 'Shared Title')
      await createModule(courseId, { title: 'Shared Title', slug: firstSlug })

      const secondSlug = await generateModuleSlug(courseId, 'Shared Title')
      expect(secondSlug).toBe(`${firstSlug}-2`)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})

describeIfDb('update module metadata integration', () => {
  let actorUserId: string
  let courseId: string
  let foreignCourseId: string
  let moduleId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Update Module Admin',
      email: `update-module-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `update-module-v1-${runId}`,
        title: 'Update Module Course',
        slug: `update-module-${runId}`,
        shortDescription: 'Update module integration.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const foreignCourse = await createCourse(
      {
        internalName: `update-module-foreign-v1-${runId}`,
        title: 'Foreign Course',
        slug: `update-module-foreign-${runId}`,
        shortDescription: 'Foreign course.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    foreignCourseId = String(foreignCourse._id)
    createdCourseIds.push(foreignCourseId)

    const courseModule = await createModule(courseId, {
      title: 'Original Module',
      slug: `original-module-${runId}`,
      description: 'Original description',
      publicationStatus: 'draft',
    })
    moduleId = String(courseModule._id)
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
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
    'updates metadata without changing slug',
    async () => {
      const before = await CourseModule.findById(moduleId).lean()

      const result = await updateModuleMetadata(courseId, moduleId, {
        title: 'Updated Module Title',
        description: 'Updated description',
        publicationStatus: 'published',
      })

      expect(result.updated).toBe(true)
      expect(result.module.title).toBe('Updated Module Title')
      expect(result.module.publicationStatus).toBe('published')
      expect(result.module.slug).toBe(before?.slug)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'clears description and skips no-op writes',
    async () => {
      const cleared = await updateModuleMetadata(courseId, moduleId, {
        title: 'Updated Module Title',
        publicationStatus: 'published',
      })

      expect(cleared.updated).toBe(true)
      expect(cleared.module.description).toBeUndefined()

      const noOp = await updateModuleMetadata(courseId, moduleId, {
        title: 'Updated Module Title',
        publicationStatus: 'published',
      })

      expect(noOp.updated).toBe(false)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'rejects cross-course updates',
    async () => {
      await expect(
        updateModuleMetadata(foreignCourseId, moduleId, {
          title: 'Hacked',
          publicationStatus: 'draft',
        }),
      ).rejects.toBeInstanceOf(CourseModuleNotFoundError)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
