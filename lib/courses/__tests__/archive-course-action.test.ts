import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockArchiveCourse = vi.fn()
const mockRevalidatePath = vi.fn()
const mockRedirect = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/course-service', () => ({
  archiveCourse: (...args: unknown[]) => mockArchiveCourse(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

import { archiveCourseAction } from '../actions/archive-course'
import {
  ARCHIVE_COURSE_NOT_ALLOWED_ERROR,
  GENERIC_ARCHIVE_COURSE_ERROR,
  INVALID_ARCHIVE_COURSE_REQUEST_ERROR,
  UNAUTHORIZED_ARCHIVE_COURSE_ERROR,
} from '../actions/archive-course-action-state'
import {
  CourseArchiveNotAllowedError,
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

describe('archiveCourseAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockArchiveCourse.mockResolvedValue({ archived: true, course: { _id: COURSE_ID } })
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })
  })

  it('allows admin to archive and redirects to details', async () => {
    await expect(archiveCourseAction(COURSE_ID)).rejects.toThrow('NEXT_REDIRECT')

    expect(mockArchiveCourse).toHaveBeenCalledWith(COURSE_ID, ADMIN_USER.id)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/courses')
    expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/courses/${COURSE_ID}`)
    expect(mockRedirect).toHaveBeenCalledWith(`/admin/courses/${COURSE_ID}`)
  })

  it('rejects guest requests', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const result = await archiveCourseAction(COURSE_ID)

    expect(result.status).toBe('error')
    expect(result.message).toBe(UNAUTHORIZED_ARCHIVE_COURSE_ERROR)
    expect(mockArchiveCourse).not.toHaveBeenCalled()
  })

  it('rejects student requests', async () => {
    mockGetCurrentUser.mockResolvedValue({ ...ADMIN_USER, role: 'student' })

    const result = await archiveCourseAction(COURSE_ID)

    expect(result.status).toBe('error')
    expect(result.message).toBe(UNAUTHORIZED_ARCHIVE_COURSE_ERROR)
  })

  it('returns a safe message for non-draft archive attempts', async () => {
    mockArchiveCourse.mockRejectedValue(new CourseArchiveNotAllowedError())

    const result = await archiveCourseAction(COURSE_ID)

    expect(result.status).toBe('error')
    expect(result.message).toBe(ARCHIVE_COURSE_NOT_ALLOWED_ERROR)
  })

  it('returns invalid request for missing courses', async () => {
    mockArchiveCourse.mockRejectedValue(new CourseNotFoundError())

    const result = await archiveCourseAction(COURSE_ID)

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_ARCHIVE_COURSE_REQUEST_ERROR)
  })

  it('does not expose raw Mongo errors', async () => {
    mockArchiveCourse.mockRejectedValue({ code: 11000, message: 'E11000 duplicate key error' })

    const result = await archiveCourseAction(COURSE_ID)

    expect(result.message).toBe(GENERIC_ARCHIVE_COURSE_ERROR)
    expect(JSON.stringify(result)).not.toContain('E11000')
  })
})
