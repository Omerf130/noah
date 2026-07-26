import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, CourseModule, User } from '../../db/models'
import {
  assertModuleBelongsToCourse,
  createModule,
  deleteModule,
  generateModuleSlug,
  moveModuleInCourse,
  updateModule,
} from '../services/module-service'
import { CourseModuleNotFoundError, CourseValidationError } from '../services/errors'
import { createCourse } from '../services/course-service'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('module service ownership integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleId: string
  let foreignCourseId: string

  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Module Ownership Admin',
      email: `module-ownership-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `module-ownership-v1-${runId}`,
        title: 'Module Ownership Course',
        slug: `module-ownership-${runId}`,
        shortDescription: 'Ownership tests.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const foreignCourse = await createCourse(
      {
        internalName: `module-foreign-v1-${runId}`,
        title: 'Foreign Course',
        slug: `module-foreign-${runId}`,
        shortDescription: 'Foreign course.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    foreignCourseId = String(foreignCourse._id)
    createdCourseIds.push(foreignCourseId)

    const courseModule = await createModule(courseId, {
      title: 'Owned Module',
      slug: `owned-module-${runId}`,
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
    'rejects cross-course update, delete, move, and ownership checks',
    async () => {
      await expect(updateModule(moduleId, { title: 'Hacked' }, foreignCourseId)).rejects.toBeInstanceOf(
        CourseModuleNotFoundError,
      )

      await expect(deleteModule(moduleId, foreignCourseId)).rejects.toBeInstanceOf(
        CourseModuleNotFoundError,
      )

      await expect(
        moveModuleInCourse(foreignCourseId, moduleId, 'down'),
      ).rejects.toBeInstanceOf(CourseModuleNotFoundError)

      await expect(assertModuleBelongsToCourse(foreignCourseId, moduleId)).rejects.toBeInstanceOf(
        CourseModuleNotFoundError,
      )
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'allows scoped update when courseId matches',
    async () => {
      const updated = await updateModule(
        moduleId,
        { title: 'Updated Owned Module' },
        courseId,
      )

      expect(updated.title).toBe('Updated Owned Module')
    },
    INTEGRATION_TIMEOUT_MS,
  )
})

describeIfDb('module slug generation integration', () => {
  let courseId: string
  let actorUserId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Module Slug Admin',
      email: `module-slug-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `module-slug-v1-${runId}`,
        title: 'Module Slug Course',
        slug: `module-slug-${runId}`,
        shortDescription: 'Slug tests.',
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
    'generates slug from title and resolves collisions with suffixes',
    async () => {
      const firstSlug = await generateModuleSlug(courseId, 'Intro Module')
      expect(firstSlug).toBe('intro-module')

      await createModule(courseId, { title: 'Intro Module', slug: firstSlug })

      const secondSlug = await generateModuleSlug(courseId, 'Intro Module')
      expect(secondSlug).toBe('intro-module-2')
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'creates module without client slug using generated slug',
    async () => {
      const created = await createModule(courseId, {
        title: 'Auto Slug Module',
      })

      expect(created.slug).toBe('auto-slug-module')
    },
    INTEGRATION_TIMEOUT_MS,
  )
})

describeIfDb('module count sync integration', () => {
  let actorUserId: string
  let courseId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Module Count Admin',
      email: `module-count-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `module-count-v1-${runId}`,
        title: 'Module Count Course',
        slug: `module-count-${runId}`,
        shortDescription: 'Count sync tests.',
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
    'increments and decrements Course.moduleCount with atomic updates',
    async () => {
      const before = await Course.findById(courseId).lean()
      expect(before?.moduleCount).toBe(0)

      const created = await createModule(courseId, {
        title: 'Count Module One',
        slug: `count-module-one-${runId}`,
      })

      const afterCreate = await Course.findById(courseId).lean()
      expect(afterCreate?.moduleCount).toBe(1)

      await deleteModule(String(created._id), courseId)

      const afterDelete = await Course.findById(courseId).lean()
      expect(afterDelete?.moduleCount).toBe(0)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})

describeIfDb('moveModuleInCourse integration', () => {
  let actorUserId: string
  let courseId: string
  let moduleOneId: string
  let moduleTwoId: string
  const createdCourseIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const actor = await User.create({
      fullName: 'Module Move Admin',
      email: `module-move-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })
    actorUserId = String(actor._id)
    createdUserIds.push(actorUserId)

    const course = await createCourse(
      {
        internalName: `module-move-v1-${runId}`,
        title: 'Module Move Course',
        slug: `module-move-${runId}`,
        shortDescription: 'Move tests.',
        instructorId: actorUserId,
      },
      actorUserId,
    )
    courseId = String(course._id)
    createdCourseIds.push(courseId)

    const moduleOne = await createModule(courseId, {
      title: 'Module One',
      slug: `module-one-${runId}`,
    })
    moduleOneId = String(moduleOne._id)

    const moduleTwo = await createModule(courseId, {
      title: 'Module Two',
      slug: `module-two-${runId}`,
    })
    moduleTwoId = String(moduleTwo._id)
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
    'moves a module down and rejects invalid boundary moves',
    async () => {
      const moved = await moveModuleInCourse(courseId, moduleOneId, 'down')
      expect(moved.map((module) => String(module._id))).toEqual([moduleTwoId, moduleOneId])

      await expect(moveModuleInCourse(courseId, moduleOneId, 'down')).rejects.toBeInstanceOf(
        CourseValidationError,
      )

      await expect(moveModuleInCourse(courseId, moduleTwoId, 'up')).rejects.toBeInstanceOf(
        CourseValidationError,
      )
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
