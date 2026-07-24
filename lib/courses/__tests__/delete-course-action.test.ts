import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockDeleteCoursePermanently = vi.fn()
const mockRevalidatePath = vi.fn()
const mockRedirect = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/course-deletion-service', () => ({
  deleteCoursePermanently: (...args: unknown[]) => mockDeleteCoursePermanently(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

import { deleteCourseAction } from '../actions/delete-course'
import {
  GENERIC_DELETE_COURSE_ERROR,
  INVALID_DELETE_COURSE_REQUEST_ERROR,
  UNAUTHORIZED_DELETE_COURSE_ERROR,
} from '../actions/delete-course-action-state'
import {
  CourseDeletionConfirmationError,
  CourseDeletionFailedError,
  CourseDeletionNotEligibleError,
  CourseNotFoundError,
} from '../services/errors'

const COURSE_ID = '507f1f77bcf86cd799439011'

const ADMIN_USER = {
  id: '507f1f77bcf86cd799439099',
  fullName: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('deleteCourseAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteCoursePermanently.mockResolvedValue({ deleted: true, courseId: COURSE_ID })
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })
  })

  it('allows admin to delete and redirects to the list', async () => {
    await expect(deleteCourseAction(COURSE_ID, 'Course Title')).rejects.toThrow('NEXT_REDIRECT')

    expect(mockDeleteCoursePermanently).toHaveBeenCalledWith(
      COURSE_ID,
      ADMIN_USER.id,
      'Course Title',
    )
    expect(mockRedirect).toHaveBeenCalledWith('/admin/courses')
  })

  it('rejects guest requests', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const result = await deleteCourseAction(COURSE_ID, 'Course Title')

    expect(result.status).toBe('error')
    expect(result.message).toBe(UNAUTHORIZED_DELETE_COURSE_ERROR)
    expect(mockDeleteCoursePermanently).not.toHaveBeenCalled()
  })

  it('maps wrong confirmation titles to a safe message', async () => {
    mockDeleteCoursePermanently.mockRejectedValue(new CourseDeletionConfirmationError())

    const result = await deleteCourseAction(COURSE_ID, 'Wrong Title')

    expect(result.status).toBe('error')
    expect(result.message).toContain('שם הקורס')
  })

  it('maps ineligible deletion to a safe Hebrew message', async () => {
    mockDeleteCoursePermanently.mockRejectedValue(
      new CourseDeletionNotEligibleError('לא ניתן למחוק קורס זה.'),
    )

    const result = await deleteCourseAction(COURSE_ID, 'Course Title')

    expect(result.status).toBe('error')
    expect(result.message).toBe('לא ניתן למחוק קורס זה.')
  })

  it('maps deletion failure when deletedCount is not 1', async () => {
    mockDeleteCoursePermanently.mockRejectedValue(new CourseDeletionFailedError())

    const result = await deleteCourseAction(COURSE_ID, 'Course Title')

    expect(result.status).toBe('error')
    expect(result.message).toContain('מחיקת הקורס נכשלה')
  })

  it('returns invalid request for missing courses', async () => {
    mockDeleteCoursePermanently.mockRejectedValue(new CourseNotFoundError())

    const result = await deleteCourseAction(COURSE_ID, 'Course Title')

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_DELETE_COURSE_REQUEST_ERROR)
  })

  it('does not expose raw Mongo errors', async () => {
    mockDeleteCoursePermanently.mockRejectedValue({ code: 11000, message: 'E11000 duplicate key error' })

    const result = await deleteCourseAction(COURSE_ID, 'Course Title')

    expect(result.message).toBe(GENERIC_DELETE_COURSE_ERROR)
    expect(JSON.stringify(result)).not.toContain('E11000')
  })
})
