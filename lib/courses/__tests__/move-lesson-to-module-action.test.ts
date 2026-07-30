import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockMoveLessonToModule = vi.fn()
const mockRevalidatePath = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/lesson-service', () => ({
  moveLessonToModule: (...args: unknown[]) => mockMoveLessonToModule(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

import { moveLessonToModuleAction } from '../actions/move-lesson-to-module'
import {
  GENERIC_MOVE_LESSON_TO_MODULE_ERROR,
  INVALID_MOVE_LESSON_TO_MODULE_REQUEST_ERROR,
  UNAUTHORIZED_MOVE_LESSON_TO_MODULE_ERROR,
} from '../actions/move-lesson-to-module-action-state'
import { CourseValidationError, LessonNotFoundError } from '../services/errors'

const COURSE_ID = '507f1f77bcf86cd799439011'
const LESSON_ID = '507f1f77bcf86cd799439013'
const TARGET_MODULE_ID = '507f1f77bcf86cd799439014'

const ADMIN_USER = {
  id: '507f1f77bcf86cd799439021',
  fullName: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('moveLessonToModuleAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('moves a lesson to another module for admin users', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveLessonToModule.mockResolvedValue({
      lessonId: LESSON_ID,
      sourceModuleId: '507f1f77bcf86cd799439012',
      targetModuleId: TARGET_MODULE_ID,
    })

    const result = await moveLessonToModuleAction(COURSE_ID, LESSON_ID, TARGET_MODULE_ID)

    expect(result.status).toBe('success')
    expect(mockMoveLessonToModule).toHaveBeenCalledWith(
      COURSE_ID,
      LESSON_ID,
      TARGET_MODULE_ID,
    )
  })

  it('blocks unauthorized users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const result = await moveLessonToModuleAction(COURSE_ID, LESSON_ID, TARGET_MODULE_ID)
    expect(result.message).toBe(UNAUTHORIZED_MOVE_LESSON_TO_MODULE_ERROR)
  })

  it('rejects invalid ids', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    expect(
      (await moveLessonToModuleAction('bad-id', LESSON_ID, TARGET_MODULE_ID)).message,
    ).toBe(INVALID_MOVE_LESSON_TO_MODULE_REQUEST_ERROR)
    expect(
      (await moveLessonToModuleAction(COURSE_ID, 'bad-id', TARGET_MODULE_ID)).message,
    ).toBe(INVALID_MOVE_LESSON_TO_MODULE_REQUEST_ERROR)
    expect(
      (await moveLessonToModuleAction(COURSE_ID, LESSON_ID, 'bad-id')).message,
    ).toBe(INVALID_MOVE_LESSON_TO_MODULE_REQUEST_ERROR)
  })

  it('returns validation message for same-module move', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveLessonToModule.mockRejectedValue(
      new CourseValidationError('השיעור כבר נמצא בפרק זה.'),
    )

    const result = await moveLessonToModuleAction(COURSE_ID, LESSON_ID, TARGET_MODULE_ID)
    expect(result.message).toBe('השיעור כבר נמצא בפרק זה.')
  })

  it('returns safe error for missing lesson', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveLessonToModule.mockRejectedValue(new LessonNotFoundError())

    const result = await moveLessonToModuleAction(COURSE_ID, LESSON_ID, TARGET_MODULE_ID)
    expect(result.message).toBe(INVALID_MOVE_LESSON_TO_MODULE_REQUEST_ERROR)
  })

  it('maps unexpected errors to generic message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveLessonToModule.mockRejectedValue(new Error('boom'))

    const result = await moveLessonToModuleAction(COURSE_ID, LESSON_ID, TARGET_MODULE_ID)
    expect(result.message).toBe(GENERIC_MOVE_LESSON_TO_MODULE_ERROR)
  })
})
