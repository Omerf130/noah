import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDb, disconnectDb } from '../../db/connect'
import { Course, User } from '../../db/models'
import { ADMIN_COURSE_LIST_PAGE_SIZE } from '../constants'
import { listAdminCourses } from '../queries/admin-course-list-query'

const hasDatabase = Boolean(process.env.MONGODB_URI)
const describeIfDb = hasDatabase ? describe : describe.skip
const INTEGRATION_TIMEOUT_MS = 15000

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

describeIfDb('listAdminCourses integration', () => {
  let actorUserId: string
  const createdCourseIds: string[] = []

  beforeAll(async () => {
    await connectDb()

    const user = await User.create({
      fullName: 'Course List Admin',
      email: `course-list-admin-${runId}@example.com`,
      passwordHash: 'test-hash',
      role: 'admin',
      isActive: true,
    })

    actorUserId = String(user._id)

    const courses = await Course.insertMany(
      Array.from({ length: 12 }, (_, index) => ({
        internalName: `list-course-${runId}-${index + 1}`,
        title: index === 0 ? 'Alpha Calculations' : `Course ${index + 1}`,
        slug: `list-course-${runId}-${index + 1}`,
        shortDescription: 'Course for admin list tests',
        status: index % 3 === 0 ? 'published' : 'draft',
        visibility: index % 2 === 0 ? 'public' : 'private',
        category: 'calculations',
        instructorId: actorUserId,
        createdBy: actorUserId,
        updatedBy: actorUserId,
        featured: index === 0,
        moduleCount: index,
        lessonCount: index * 2,
        pricing: { price: 100 + index, currency: 'ILS' },
      })),
    )

    createdCourseIds.push(...courses.map((course) => String(course._id)))
  }, INTEGRATION_TIMEOUT_MS)

  afterAll(async () => {
    if (createdCourseIds.length > 0) {
      await Course.deleteMany({ _id: { $in: createdCourseIds } })
    }

    await User.deleteOne({ email: `course-list-admin-${runId}@example.com` })
    await disconnectDb()
    await mongoose.connection.close()
  }, INTEGRATION_TIMEOUT_MS)

  it(
    'returns paginated courses with fixed page size of 10',
    async () => {
      const result = await listAdminCourses({ q: runId, sort: 'updated-desc', page: 1 })

      expect(result.pageSize).toBe(ADMIN_COURSE_LIST_PAGE_SIZE)
      expect(result.items.length).toBe(10)
      expect(result.totalItems).toBe(12)
      expect(result.totalPages).toBe(2)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'filters by search term',
    async () => {
      const result = await listAdminCourses({
        q: 'Alpha Calculations',
        sort: 'updated-desc',
        page: 1,
      })

      expect(result.totalItems).toBeGreaterThanOrEqual(1)
      expect(result.items.some((item) => item.title === 'Alpha Calculations')).toBe(true)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'filters by status and visibility',
    async () => {
      const result = await listAdminCourses({
        q: runId,
        status: 'published',
        visibility: 'public',
        sort: 'updated-desc',
        page: 1,
      })

      expect(result.items.length).toBeGreaterThan(0)
      expect(result.items.every((item) => item.status === 'published')).toBe(true)
      expect(result.items.every((item) => item.visibility === 'public')).toBe(true)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'sorts by title ascending',
    async () => {
      const result = await listAdminCourses({
        q: runId,
        sort: 'title-asc',
        page: 1,
      })

      const titles = result.items.map((item) => item.title)
      expect(titles).toEqual([...titles].sort((left, right) => left.localeCompare(right, 'he')))
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'resolves instructor and created-by display names',
    async () => {
      const result = await listAdminCourses({
        q: runId,
        sort: 'updated-desc',
        page: 1,
      })

      expect(result.items[0]?.instructorName).toBe('Course List Admin')
      expect(result.items[0]?.createdByName).toBe('Course List Admin')
      expect('instructorId' in (result.items[0] ?? {})).toBe(false)
    },
    INTEGRATION_TIMEOUT_MS,
  )

  it(
    'returns page 2 while preserving fixed page size',
    async () => {
      const pageOne = await listAdminCourses({ q: runId, sort: 'updated-desc', page: 1 })
      const pageTwo = await listAdminCourses({ q: runId, sort: 'updated-desc', page: 2 })

      expect(pageTwo.page).toBe(2)
      expect(pageTwo.pageSize).toBe(10)
      expect(pageTwo.items[0]?.id).not.toBe(pageOne.items[0]?.id)
    },
    INTEGRATION_TIMEOUT_MS,
  )
})
