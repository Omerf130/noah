import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockUpdateCourseMetadata = vi.fn()
const mockRevalidatePath = vi.fn()
const mockRedirect = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/course-service', () => ({
  updateCourseMetadata: (...args: unknown[]) => mockUpdateCourseMetadata(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

import { updateCourseAction } from '../actions/update-course'
import {
  DUPLICATE_SLUG_ERROR,
  GENERIC_UPDATE_COURSE_ERROR,
  INACTIVE_INSTRUCTOR_ERROR,
  INVALID_INSTRUCTOR_ERROR,
  INVALID_UPDATE_COURSE_REQUEST_ERROR,
  NO_CHANGES_MADE_MESSAGE,
  UNAUTHORIZED_UPDATE_COURSE_ERROR,
  initialUpdateCourseActionState,
} from '../actions/update-course-action-state'
import {
  CourseDuplicateKeyError,
  CourseInstructorError,
  CourseNotFoundError,
} from '../services/errors'

const ROUTE_COURSE_ID = '507f1f77bcf86cd799439011'
const ADMIN_USER = {
  id: '507f1f77bcf86cd799439099',
  fullName: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const STUDENT_USER = {
  ...ADMIN_USER,
  id: '507f1f77bcf86cd799439012',
  role: 'student' as const,
}

function buildFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData()

  const defaults: Record<string, string> = {
    courseId: ROUTE_COURSE_ID,
    title: 'Updated Course',
    slug: 'updated-course',
    shortDescription: 'Updated short description',
    category: 'calculations',
    price: '120',
    salePrice: '99',
    currency: 'ILS',
    visibility: 'private',
    instructorId: ADMIN_USER.id,
    ...overrides,
  }

  for (const [key, value] of Object.entries(defaults)) {
    formData.set(key, value)
  }

  return formData
}

describe('updateCourseAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockUpdateCourseMetadata.mockResolvedValue({
      updated: true,
      course: { _id: ROUTE_COURSE_ID },
    })
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })
  })

  it('allows admin to update a course and redirects to details', async () => {
    await expect(
      updateCourseAction(ROUTE_COURSE_ID, initialUpdateCourseActionState, buildFormData()),
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(mockUpdateCourseMetadata).toHaveBeenCalledWith(
      ROUTE_COURSE_ID,
      expect.objectContaining({
        title: 'Updated Course',
        slug: 'updated-course',
      }),
      ADMIN_USER.id,
    )
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/courses')
    expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/courses/${ROUTE_COURSE_ID}`)
    expect(mockRedirect).toHaveBeenCalledWith(`/admin/courses/${ROUTE_COURSE_ID}`)
  })

  it('rejects guest requests', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const result = await updateCourseAction(
      ROUTE_COURSE_ID,
      initialUpdateCourseActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(UNAUTHORIZED_UPDATE_COURSE_ERROR)
    expect(mockUpdateCourseMetadata).not.toHaveBeenCalled()
  })

  it('rejects student requests', async () => {
    mockGetCurrentUser.mockResolvedValue(STUDENT_USER)

    const result = await updateCourseAction(
      ROUTE_COURSE_ID,
      initialUpdateCourseActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(UNAUTHORIZED_UPDATE_COURSE_ERROR)
  })

  it('treats courseId mismatch as an invalid request message', async () => {
    const result = await updateCourseAction(
      ROUTE_COURSE_ID,
      initialUpdateCourseActionState,
      buildFormData({ courseId: '507f1f77bcf86cd799439088' }),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_UPDATE_COURSE_REQUEST_ERROR)
    expect(result.fieldErrors).toBeUndefined()
    expect(mockUpdateCourseMetadata).not.toHaveBeenCalled()
  })

  it('returns a friendly no-op message without redirect when nothing changed', async () => {
    mockUpdateCourseMetadata.mockResolvedValue({
      updated: false,
      course: { _id: ROUTE_COURSE_ID },
    })

    const result = await updateCourseAction(
      ROUTE_COURSE_ID,
      initialUpdateCourseActionState,
      buildFormData(),
    )

    expect(result.status).toBe('no-op')
    expect(result.message).toBe(NO_CHANGES_MADE_MESSAGE)
    expect(mockRedirect).not.toHaveBeenCalled()
    expect(mockRevalidatePath).not.toHaveBeenCalled()
  })

  it('maps duplicate slug errors to the slug field', async () => {
    mockUpdateCourseMetadata.mockRejectedValue(new CourseDuplicateKeyError('slug'))

    const result = await updateCourseAction(
      ROUTE_COURSE_ID,
      initialUpdateCourseActionState,
      buildFormData(),
    )

    expect(result.fieldErrors?.slug).toEqual([DUPLICATE_SLUG_ERROR])
  })

  it('maps invalid instructor errors to the field', async () => {
    mockUpdateCourseMetadata.mockRejectedValue(new CourseInstructorError('invalid'))

    const result = await updateCourseAction(
      ROUTE_COURSE_ID,
      initialUpdateCourseActionState,
      buildFormData(),
    )

    expect(result.fieldErrors?.instructorId).toEqual([INVALID_INSTRUCTOR_ERROR])
  })

  it('maps inactive instructor errors to the field', async () => {
    mockUpdateCourseMetadata.mockRejectedValue(new CourseInstructorError('inactive'))

    const result = await updateCourseAction(
      ROUTE_COURSE_ID,
      initialUpdateCourseActionState,
      buildFormData(),
    )

    expect(result.fieldErrors?.instructorId).toEqual([INACTIVE_INSTRUCTOR_ERROR])
  })

  it('returns invalid request when course is missing', async () => {
    mockUpdateCourseMetadata.mockRejectedValue(new CourseNotFoundError())

    const result = await updateCourseAction(
      ROUTE_COURSE_ID,
      initialUpdateCourseActionState,
      buildFormData(),
    )

    expect(result.message).toBe(INVALID_UPDATE_COURSE_REQUEST_ERROR)
  })

  it('does not expose raw Mongo errors in action state', async () => {
    mockUpdateCourseMetadata.mockRejectedValue({ code: 11000, message: 'E11000 duplicate key error' })

    const result = await updateCourseAction(
      ROUTE_COURSE_ID,
      initialUpdateCourseActionState,
      buildFormData(),
    )

    expect(result.message).toBe(GENERIC_UPDATE_COURSE_ERROR)
    expect(JSON.stringify(result)).not.toContain('E11000')
  })
})
