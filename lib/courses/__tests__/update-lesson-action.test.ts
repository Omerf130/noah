import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockUpdateLessonMetadata = vi.fn()
const mockRevalidatePath = vi.fn()
const mockRedirect = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/lesson-service', () => ({
  updateLessonMetadata: (...args: unknown[]) => mockUpdateLessonMetadata(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

import { updateLessonAction } from '../actions/update-lesson'
import {
  GENERIC_UPDATE_LESSON_ERROR,
  INVALID_UPDATE_LESSON_REQUEST_ERROR,
  NO_CHANGES_MADE_MESSAGE,
  UNAUTHORIZED_UPDATE_LESSON_ERROR,
  initialUpdateLessonActionState,
} from '../actions/update-lesson-action-state'
import { LessonNotFoundError } from '../services/errors'

const COURSE_ID = '507f1f77bcf86cd799439011'
const MODULE_ID = '507f1f77bcf86cd799439012'
const LESSON_ID = '507f1f77bcf86cd799439013'
const FOREIGN_COURSE_ID = '507f1f77bcf86cd799439099'

const ADMIN_USER = {
  id: '507f1f77bcf86cd799439021',
  fullName: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const STUDENT_USER = {
  ...ADMIN_USER,
  id: '507f1f77bcf86cd799439022',
  role: 'student' as const,
}

function buildFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData()

  const defaults: Record<string, string> = {
    title: 'שיעור מעודכן',
    description: 'תיאור מעודכן',
    publicationStatus: 'published',
    courseId: COURSE_ID,
    moduleId: MODULE_ID,
    lessonId: LESSON_ID,
    ...overrides,
  }

  for (const [key, value] of Object.entries(defaults)) {
    formData.set(key, value)
  }

  return formData
}

describe('updateLessonAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })
  })

  it('updates lesson metadata for admin users and redirects to lesson list', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockUpdateLessonMetadata.mockResolvedValue({ updated: true, lesson: {} })

    await expect(
      updateLessonAction(
        COURSE_ID,
        MODULE_ID,
        LESSON_ID,
        initialUpdateLessonActionState,
        buildFormData(),
      ),
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(mockUpdateLessonMetadata).toHaveBeenCalledWith(COURSE_ID, MODULE_ID, LESSON_ID, {
      title: 'שיעור מעודכן',
      description: 'תיאור מעודכן',
      publicationStatus: 'published',
    })
    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/courses/${COURSE_ID}/content/${MODULE_ID}`,
    )
  })

  it('blocks guest and student users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const guestResult = await updateLessonAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      initialUpdateLessonActionState,
      buildFormData(),
    )
    expect(guestResult.message).toBe(UNAUTHORIZED_UPDATE_LESSON_ERROR)

    mockGetCurrentUser.mockResolvedValue(STUDENT_USER)
    const studentResult = await updateLessonAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      initialUpdateLessonActionState,
      buildFormData(),
    )
    expect(studentResult.message).toBe(UNAUTHORIZED_UPDATE_LESSON_ERROR)
  })

  it('rejects forged courseId mismatch', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    const result = await updateLessonAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      initialUpdateLessonActionState,
      buildFormData({ courseId: FOREIGN_COURSE_ID }),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_UPDATE_LESSON_REQUEST_ERROR)
  })

  it('returns no-op state when nothing changed', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockUpdateLessonMetadata.mockResolvedValue({ updated: false, lesson: {} })

    const result = await updateLessonAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      initialUpdateLessonActionState,
      buildFormData(),
    )

    expect(result.status).toBe('no-op')
    expect(result.message).toBe(NO_CHANGES_MADE_MESSAGE)
  })

  it('returns safe error for invalid lesson', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockUpdateLessonMetadata.mockRejectedValue(new LessonNotFoundError())

    const result = await updateLessonAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      initialUpdateLessonActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_UPDATE_LESSON_REQUEST_ERROR)
  })

  it('maps unexpected errors to generic update message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockUpdateLessonMetadata.mockRejectedValue(new Error('boom'))

    const result = await updateLessonAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      initialUpdateLessonActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(GENERIC_UPDATE_LESSON_ERROR)
  })
})
