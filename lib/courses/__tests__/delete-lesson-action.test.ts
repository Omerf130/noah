import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockDeleteLessonFromModule = vi.fn()
const mockRevalidatePath = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/lesson-service', () => ({
  deleteLessonFromModule: (...args: unknown[]) => mockDeleteLessonFromModule(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

import { deleteLessonAction } from '../actions/delete-lesson'
import {
  GENERIC_DELETE_LESSON_ERROR,
  INVALID_DELETE_LESSON_REQUEST_ERROR,
  LESSON_COUNT_SYNC_ERROR,
  UNAUTHORIZED_DELETE_LESSON_ERROR,
} from '../actions/delete-lesson-action-state'
import {
  CourseValidationError,
  LessonCountSyncError,
  LessonNotFoundError,
} from '../services/errors'

const COURSE_ID = '507f1f77bcf86cd799439011'
const MODULE_ID = '507f1f77bcf86cd799439012'
const LESSON_ID = '507f1f77bcf86cd799439013'

const BLOCKS_MESSAGE =
  'לא ניתן למחוק את השיעור משום שקיימים בו בלוקי תוכן. יש להסיר את התוכן תחילה.'

const ADMIN_USER = {
  id: '507f1f77bcf86cd799439021',
  fullName: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('deleteLessonAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes a lesson for admin users', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteLessonFromModule.mockResolvedValue({ deleted: true, lessonId: LESSON_ID })

    const result = await deleteLessonAction(COURSE_ID, MODULE_ID, LESSON_ID)

    expect(result.status).toBe('success')
    expect(mockDeleteLessonFromModule).toHaveBeenCalledWith(COURSE_ID, MODULE_ID, LESSON_ID)
  })

  it('blocks unauthorized users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const result = await deleteLessonAction(COURSE_ID, MODULE_ID, LESSON_ID)
    expect(result.message).toBe(UNAUTHORIZED_DELETE_LESSON_ERROR)
  })

  it('rejects invalid ids', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    expect((await deleteLessonAction('bad-id', MODULE_ID, LESSON_ID)).message).toBe(
      INVALID_DELETE_LESSON_REQUEST_ERROR,
    )
    expect((await deleteLessonAction(COURSE_ID, 'bad-id', LESSON_ID)).message).toBe(
      INVALID_DELETE_LESSON_REQUEST_ERROR,
    )
    expect((await deleteLessonAction(COURSE_ID, MODULE_ID, 'bad-id')).message).toBe(
      INVALID_DELETE_LESSON_REQUEST_ERROR,
    )
  })

  it('returns blocks rejection message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteLessonFromModule.mockRejectedValue(new CourseValidationError(BLOCKS_MESSAGE))

    const result = await deleteLessonAction(COURSE_ID, MODULE_ID, LESSON_ID)
    expect(result.message).toBe(BLOCKS_MESSAGE)
  })

  it('returns safe error for missing lesson', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteLessonFromModule.mockRejectedValue(new LessonNotFoundError())

    const result = await deleteLessonAction(COURSE_ID, MODULE_ID, LESSON_ID)
    expect(result.message).toBe(INVALID_DELETE_LESSON_REQUEST_ERROR)
  })

  it('maps count sync errors', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteLessonFromModule.mockRejectedValue(new LessonCountSyncError())

    const result = await deleteLessonAction(COURSE_ID, MODULE_ID, LESSON_ID)
    expect(result.message).toBe(LESSON_COUNT_SYNC_ERROR)
  })

  it('maps unexpected errors to generic delete message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteLessonFromModule.mockRejectedValue(new Error('boom'))

    const result = await deleteLessonAction(COURSE_ID, MODULE_ID, LESSON_ID)
    expect(result.message).toBe(GENERIC_DELETE_LESSON_ERROR)
  })
})
