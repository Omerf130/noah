import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockDeleteContentBlockFromLesson = vi.fn()
const mockRevalidatePath = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/content-block-order-service', () => ({
  deleteContentBlockFromLesson: (...args: unknown[]) => mockDeleteContentBlockFromLesson(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

import { deleteContentBlockAction } from '../actions/delete-content-block'
import {
  GENERIC_DELETE_CONTENT_BLOCK_ERROR,
  INVALID_DELETE_CONTENT_BLOCK_REQUEST_ERROR,
  UNAUTHORIZED_DELETE_CONTENT_BLOCK_ERROR,
} from '../actions/delete-content-block-action-state'
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

describe('deleteContentBlockAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes a content block for admin users', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteContentBlockFromLesson.mockResolvedValue({ deleted: true, blockId: BLOCK_ID })

    const result = await deleteContentBlockAction(COURSE_ID, MODULE_ID, LESSON_ID, BLOCK_ID)

    expect(result.status).toBe('success')
    expect(mockDeleteContentBlockFromLesson).toHaveBeenCalledWith(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      BLOCK_ID,
    )
  })

  it('blocks guest users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const result = await deleteContentBlockAction(COURSE_ID, MODULE_ID, LESSON_ID, BLOCK_ID)
    expect(result.message).toBe(UNAUTHORIZED_DELETE_CONTENT_BLOCK_ERROR)
  })

  it('rejects invalid ids', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    expect(
      (await deleteContentBlockAction('bad-id', MODULE_ID, LESSON_ID, BLOCK_ID)).message,
    ).toBe(INVALID_DELETE_CONTENT_BLOCK_REQUEST_ERROR)
    expect(
      (await deleteContentBlockAction(COURSE_ID, 'bad-id', LESSON_ID, BLOCK_ID)).message,
    ).toBe(INVALID_DELETE_CONTENT_BLOCK_REQUEST_ERROR)
    expect(
      (await deleteContentBlockAction(COURSE_ID, MODULE_ID, 'bad-id', BLOCK_ID)).message,
    ).toBe(INVALID_DELETE_CONTENT_BLOCK_REQUEST_ERROR)
    expect(
      (await deleteContentBlockAction(COURSE_ID, MODULE_ID, LESSON_ID, 'bad-id')).message,
    ).toBe(INVALID_DELETE_CONTENT_BLOCK_REQUEST_ERROR)
  })

  it('returns safe error for missing block', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteContentBlockFromLesson.mockRejectedValue(new ContentBlockNotFoundError())

    const result = await deleteContentBlockAction(COURSE_ID, MODULE_ID, LESSON_ID, BLOCK_ID)
    expect(result.message).toBe(INVALID_DELETE_CONTENT_BLOCK_REQUEST_ERROR)
  })

  it('maps unexpected errors to generic delete message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteContentBlockFromLesson.mockRejectedValue(new Error('boom'))

    const result = await deleteContentBlockAction(COURSE_ID, MODULE_ID, LESSON_ID, BLOCK_ID)
    expect(result.message).toBe(GENERIC_DELETE_CONTENT_BLOCK_ERROR)
  })
})
