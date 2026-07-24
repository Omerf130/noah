import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockCreateCourse = vi.fn()
const mockRevalidatePath = vi.fn()
const mockRedirect = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/course-service', () => ({
  createCourse: (...args: unknown[]) => mockCreateCourse(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

import { createCourseAction } from '../actions/create-course'
import {
  DUPLICATE_SLUG_AS_INTERNAL_ERROR,
  DUPLICATE_SLUG_ERROR,
  GENERIC_CREATE_COURSE_ERROR,
  INACTIVE_INSTRUCTOR_ERROR,
  INVALID_INSTRUCTOR_ERROR,
  UNAUTHORIZED_CREATE_COURSE_ERROR,
} from '../actions/create-course-action-state'
import { initialCreateCourseActionState } from '../actions/create-course-action-state'
import {
  CourseDuplicateKeyError,
  CourseInstructorError,
  CourseValidationError,
} from '../services/errors'

const ADMIN_USER = {
  id: '507f1f77bcf86cd799439011',
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
    title: 'New Course',
    slug: 'new-course',
    shortDescription: 'Short description',
    category: 'calculations',
    price: '0',
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

describe('createCourseAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockCreateCourse.mockResolvedValue({ _id: '507f1f77bcf86cd799439099' })
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })
  })

  it('allows admin to create a course and redirects to the list', async () => {
    await expect(
      createCourseAction(initialCreateCourseActionState, buildFormData()),
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(mockCreateCourse).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Course',
        slug: 'new-course',
        internalName: 'new-course',
        instructorId: ADMIN_USER.id,
      }),
      ADMIN_USER.id,
    )
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/courses')
    expect(mockRedirect).toHaveBeenCalledWith('/admin/courses')
  })

  it('rejects guest requests without calling the service', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const result = await createCourseAction(initialCreateCourseActionState, buildFormData())

    expect(result.status).toBe('error')
    expect(result.message).toBe(UNAUTHORIZED_CREATE_COURSE_ERROR)
    expect(mockCreateCourse).not.toHaveBeenCalled()
  })

  it('rejects student requests without calling the service', async () => {
    mockGetCurrentUser.mockResolvedValue(STUDENT_USER)

    const result = await createCourseAction(initialCreateCourseActionState, buildFormData())

    expect(result.status).toBe('error')
    expect(result.message).toBe(UNAUTHORIZED_CREATE_COURSE_ERROR)
    expect(mockCreateCourse).not.toHaveBeenCalled()
  })

  it('maps duplicate internalName errors to the slug field', async () => {
    mockCreateCourse.mockRejectedValue(new CourseDuplicateKeyError('internalName'))

    const result = await createCourseAction(initialCreateCourseActionState, buildFormData())

    expect(result.fieldErrors?.slug).toEqual([DUPLICATE_SLUG_AS_INTERNAL_ERROR])
    expect(result.fieldErrors?.internalName).toBeUndefined()
  })

  it('maps duplicate slug errors to the field', async () => {
    mockCreateCourse.mockRejectedValue(new CourseDuplicateKeyError('slug'))

    const result = await createCourseAction(initialCreateCourseActionState, buildFormData())

    expect(result.fieldErrors?.slug).toEqual([DUPLICATE_SLUG_ERROR])
  })

  it('ignores forged internalName in FormData and derives it from slug', async () => {
    await expect(
      createCourseAction(
        initialCreateCourseActionState,
        buildFormData({ internalName: 'forged-internal-name' }),
      ),
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(mockCreateCourse).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'new-course',
        internalName: 'new-course',
      }),
      ADMIN_USER.id,
    )
    expect(mockCreateCourse).not.toHaveBeenCalledWith(
      expect.objectContaining({
        internalName: 'forged-internal-name',
      }),
      expect.anything(),
    )
  })

  it('maps invalid instructor errors to the field', async () => {
    mockCreateCourse.mockRejectedValue(new CourseInstructorError('invalid'))

    const result = await createCourseAction(initialCreateCourseActionState, buildFormData())

    expect(result.fieldErrors?.instructorId).toEqual([INVALID_INSTRUCTOR_ERROR])
  })

  it('maps inactive instructor errors to the field', async () => {
    mockCreateCourse.mockRejectedValue(new CourseInstructorError('inactive'))

    const result = await createCourseAction(initialCreateCourseActionState, buildFormData())

    expect(result.fieldErrors?.instructorId).toEqual([INACTIVE_INSTRUCTOR_ERROR])
  })

  it('does not expose raw Mongo errors in action state', async () => {
    mockCreateCourse.mockRejectedValue({ code: 11000, message: 'E11000 duplicate key error' })

    const result = await createCourseAction(initialCreateCourseActionState, buildFormData())

    expect(result.message).toBe(GENERIC_CREATE_COURSE_ERROR)
    expect(JSON.stringify(result)).not.toContain('E11000')
  })

  it('returns validation errors without calling redirect', async () => {
    const result = await createCourseAction(
      initialCreateCourseActionState,
      buildFormData({ title: '' }),
    )

    expect(result.status).toBe('error')
    expect(result.fieldErrors?.title?.length).toBeGreaterThan(0)
    expect(mockCreateCourse).not.toHaveBeenCalled()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('preserves submitted values after validation failure', async () => {
    const result = await createCourseAction(
      initialCreateCourseActionState,
      buildFormData({ title: '', slug: 'kept-slug' }),
    )

    expect(result.values?.slug).toBe('kept-slug')
  })

  it('handles unexpected service validation errors safely', async () => {
    mockCreateCourse.mockRejectedValue(new CourseValidationError('invalid'))

    const result = await createCourseAction(initialCreateCourseActionState, buildFormData())

    expect(result.message).toBe(GENERIC_CREATE_COURSE_ERROR)
  })
})
