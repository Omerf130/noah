import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockMoveModuleInCourse = vi.fn()
const mockRevalidatePath = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/module-service', () => ({
  moveModuleInCourse: (...args: unknown[]) => mockMoveModuleInCourse(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

import { moveModuleAction } from '../actions/move-module'
import {
  GENERIC_MOVE_MODULE_ERROR,
  INVALID_MOVE_MODULE_REQUEST_ERROR,
  UNAUTHORIZED_MOVE_MODULE_ERROR,
} from '../actions/move-module-action-state'
import {
  CourseModuleNotFoundError,
  CourseNotFoundError,
  CourseValidationError,
} from '../services/errors'

const COURSE_ID = '507f1f77bcf86cd799439011'
const MODULE_ID = '507f1f77bcf86cd799439012'

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

describe('moveModuleAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('moves a module down for admin users and revalidates content', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveModuleInCourse.mockResolvedValue([])

    const result = await moveModuleAction(COURSE_ID, MODULE_ID, 'down')

    expect(result.status).toBe('success')
    expect(mockMoveModuleInCourse).toHaveBeenCalledWith(COURSE_ID, MODULE_ID, 'down')
    expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/courses/${COURSE_ID}/content`)
    expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/courses/${COURSE_ID}`)
  })

  it('moves a module up for admin users', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveModuleInCourse.mockResolvedValue([])

    const result = await moveModuleAction(COURSE_ID, MODULE_ID, 'up')

    expect(result.status).toBe('success')
    expect(mockMoveModuleInCourse).toHaveBeenCalledWith(COURSE_ID, MODULE_ID, 'up')
  })

  it('blocks guest and student users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const guestResult = await moveModuleAction(COURSE_ID, MODULE_ID, 'up')
    expect(guestResult.status).toBe('error')
    expect(guestResult.message).toBe(UNAUTHORIZED_MOVE_MODULE_ERROR)

    mockGetCurrentUser.mockResolvedValue(STUDENT_USER)
    const studentResult = await moveModuleAction(COURSE_ID, MODULE_ID, 'up')
    expect(studentResult.status).toBe('error')
    expect(studentResult.message).toBe(UNAUTHORIZED_MOVE_MODULE_ERROR)
  })

  it('rejects invalid course, module, or direction ids', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    const invalidCourse = await moveModuleAction('bad-id', MODULE_ID, 'up')
    expect(invalidCourse.status).toBe('error')
    expect(invalidCourse.message).toBe(INVALID_MOVE_MODULE_REQUEST_ERROR)

    const invalidModule = await moveModuleAction(COURSE_ID, 'bad-id', 'up')
    expect(invalidModule.status).toBe('error')
    expect(invalidModule.message).toBe(INVALID_MOVE_MODULE_REQUEST_ERROR)

    const invalidDirection = await moveModuleAction(COURSE_ID, MODULE_ID, 'sideways')
    expect(invalidDirection.status).toBe('error')
    expect(invalidDirection.message).toBe(INVALID_MOVE_MODULE_REQUEST_ERROR)
  })

  it('maps cross-course and missing module errors to invalid request', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveModuleInCourse.mockRejectedValue(new CourseModuleNotFoundError())

    const result = await moveModuleAction(COURSE_ID, MODULE_ID, 'up')

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_MOVE_MODULE_REQUEST_ERROR)
  })

  it('maps stale reorder validation errors to safe Hebrew message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveModuleInCourse.mockRejectedValue(
      new CourseValidationError('Reorder failed to update all module records in the parent scope'),
    )

    const result = await moveModuleAction(COURSE_ID, MODULE_ID, 'up')

    expect(result.status).toBe('error')
    expect(result.message).toBe(GENERIC_MOVE_MODULE_ERROR)
  })

  it('maps missing course errors to invalid request', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveModuleInCourse.mockRejectedValue(new CourseNotFoundError())

    const result = await moveModuleAction(COURSE_ID, MODULE_ID, 'down')

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_MOVE_MODULE_REQUEST_ERROR)
  })

  it('does not expose raw mongo errors', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockMoveModuleInCourse.mockRejectedValue(new Error('MongoServerError: duplicate key'))

    const result = await moveModuleAction(COURSE_ID, MODULE_ID, 'down')

    expect(result.status).toBe('error')
    expect(result.message).toBe(GENERIC_MOVE_MODULE_ERROR)
    expect(result.message).not.toContain('Mongo')
  })
})
