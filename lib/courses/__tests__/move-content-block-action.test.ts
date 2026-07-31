import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockMoveContentBlockInLesson = vi.fn()
const mockRevalidatePath = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/content-block-order-service', () => ({
  moveContentBlockInLesson: (...args: unknown[]) => mockMoveContentBlockInLesson(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

import { moveContentBlockAction } from '../actions/move-content-block'
import {
  GENERIC_MOVE_CONTENT_BLOCK_ERROR,
  INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR,
  UNAUTHORIZED_MOVE_CONTENT_BLOCK_ERROR,
} from '../actions/move-content-block-action-state'
import { ContentBlockNotFoundError } from '../services/errors'

const COURSE_ID = '507f1f77bcf86cd799439011'
const MODULE_ID = '507f1f77bcf86cd799439012'
const LESSON_ID = '507f1f77bcf86cd799439013'
const BLOCK_ID = '507f1f77bcf86cd799439014'

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

describe('moveContentBlockAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('moves a content block for admin users', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveContentBlockInLesson.mockResolvedValue({ moved: true })

    const result = await moveContentBlockAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      BLOCK_ID,
      'up',
    )

    expect(result.status).toBe('success')
    expect(mockMoveContentBlockInLesson).toHaveBeenCalledWith(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      BLOCK_ID,
      'up',
    )
  })

  it('blocks guest and student users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)
    expect(
      (await moveContentBlockAction(COURSE_ID, MODULE_ID, LESSON_ID, BLOCK_ID, 'up')).message,
    ).toBe(UNAUTHORIZED_MOVE_CONTENT_BLOCK_ERROR)

    mockGetCurrentUser.mockResolvedValue(STUDENT_USER)
    expect(
      (await moveContentBlockAction(COURSE_ID, MODULE_ID, LESSON_ID, BLOCK_ID, 'up')).message,
    ).toBe(UNAUTHORIZED_MOVE_CONTENT_BLOCK_ERROR)
  })

  it('rejects invalid ids and direction', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    expect(
      (await moveContentBlockAction('bad-id', MODULE_ID, LESSON_ID, BLOCK_ID, 'up')).message,
    ).toBe(INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR)
    expect(
      (await moveContentBlockAction(COURSE_ID, 'bad-id', LESSON_ID, BLOCK_ID, 'up')).message,
    ).toBe(INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR)
    expect(
      (await moveContentBlockAction(COURSE_ID, MODULE_ID, 'bad-id', BLOCK_ID, 'up')).message,
    ).toBe(INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR)
    expect(
      (await moveContentBlockAction(COURSE_ID, MODULE_ID, LESSON_ID, 'bad-id', 'up')).message,
    ).toBe(INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR)
    expect(
      (await moveContentBlockAction(COURSE_ID, MODULE_ID, LESSON_ID, BLOCK_ID, 'sideways')).message,
    ).toBe(INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR)
  })

  it('returns safe error for missing block', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveContentBlockInLesson.mockRejectedValue(new ContentBlockNotFoundError())

    const result = await moveContentBlockAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      BLOCK_ID,
      'up',
    )
    expect(result.message).toBe(INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR)
  })

  it('maps unexpected errors to generic move message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveContentBlockInLesson.mockRejectedValue(new Error('boom'))

    const result = await moveContentBlockAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      BLOCK_ID,
      'up',
    )
    expect(result.message).toBe(GENERIC_MOVE_CONTENT_BLOCK_ERROR)
  })
})
