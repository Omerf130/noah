import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockMoveLessonInModule = vi.fn()
const mockRevalidatePath = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/lesson-service', () => ({
  moveLessonInModule: (...args: unknown[]) => mockMoveLessonInModule(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

import { moveLessonAction } from '../actions/move-lesson'
import {
  GENERIC_MOVE_LESSON_ERROR,
  INVALID_MOVE_LESSON_REQUEST_ERROR,
  UNAUTHORIZED_MOVE_LESSON_ERROR,
} from '../actions/move-lesson-action-state'
import { LessonNotFoundError } from '../services/errors'

const COURSE_ID = '507f1f77bcf86cd799439011'
const MODULE_ID = '507f1f77bcf86cd799439012'
const LESSON_ID = '507f1f77bcf86cd799439013'

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

describe('moveLessonAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('moves a lesson for admin users', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveLessonInModule.mockResolvedValue([])

    const result = await moveLessonAction(COURSE_ID, MODULE_ID, LESSON_ID, 'down')

    expect(result.status).toBe('success')
    expect(mockMoveLessonInModule).toHaveBeenCalledWith(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      'down',
    )
  })

  it('blocks guest and student users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)
    const guestResult = await moveLessonAction(COURSE_ID, MODULE_ID, LESSON_ID, 'up')
    expect(guestResult.message).toBe(UNAUTHORIZED_MOVE_LESSON_ERROR)

    mockGetCurrentUser.mockResolvedValue(STUDENT_USER)
    const studentResult = await moveLessonAction(COURSE_ID, MODULE_ID, LESSON_ID, 'up')
    expect(studentResult.message).toBe(UNAUTHORIZED_MOVE_LESSON_ERROR)
  })

  it('rejects invalid ids and direction', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    expect((await moveLessonAction('bad-id', MODULE_ID, LESSON_ID, 'up')).message).toBe(
      INVALID_MOVE_LESSON_REQUEST_ERROR,
    )
    expect((await moveLessonAction(COURSE_ID, 'bad-id', LESSON_ID, 'up')).message).toBe(
      INVALID_MOVE_LESSON_REQUEST_ERROR,
    )
    expect((await moveLessonAction(COURSE_ID, MODULE_ID, 'bad-id', 'up')).message).toBe(
      INVALID_MOVE_LESSON_REQUEST_ERROR,
    )
    expect((await moveLessonAction(COURSE_ID, MODULE_ID, LESSON_ID, 'sideways')).message).toBe(
      INVALID_MOVE_LESSON_REQUEST_ERROR,
    )
  })

  it('returns safe error for missing lesson', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveLessonInModule.mockRejectedValue(new LessonNotFoundError())

    const result = await moveLessonAction(COURSE_ID, MODULE_ID, LESSON_ID, 'up')
    expect(result.message).toBe(INVALID_MOVE_LESSON_REQUEST_ERROR)
  })

  it('maps unexpected errors to generic move message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveLessonInModule.mockRejectedValue(new Error('boom'))

    const result = await moveLessonAction(COURSE_ID, MODULE_ID, LESSON_ID, 'up')
    expect(result.message).toBe(GENERIC_MOVE_LESSON_ERROR)
  })
})
