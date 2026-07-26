import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockDeleteModuleFromCourse = vi.fn()
const mockRevalidatePath = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/module-service', () => ({
  deleteModuleFromCourse: (...args: unknown[]) => mockDeleteModuleFromCourse(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

import { deleteModuleAction } from '../actions/delete-module'
import {
  GENERIC_DELETE_MODULE_ERROR,
  INVALID_DELETE_MODULE_REQUEST_ERROR,
  MODULE_COUNT_SYNC_ERROR,
  UNAUTHORIZED_DELETE_MODULE_ERROR,
} from '../actions/delete-module-action-state'
import {
  CourseModuleNotFoundError,
  CourseValidationError,
  ModuleCountSyncError,
  ModuleDeletionFailedError,
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

const LESSONS_BLOCK_MESSAGE =
  'לא ניתן למחוק את הפרק משום שקיימים בו שיעורים. יש למחוק או להעביר את השיעורים תחילה.'

describe('deleteModuleAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes an empty module for admin users and revalidates content', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteModuleFromCourse.mockResolvedValue({ deleted: true, moduleId: MODULE_ID })

    const result = await deleteModuleAction(COURSE_ID, MODULE_ID)

    expect(result.status).toBe('success')
    expect(mockDeleteModuleFromCourse).toHaveBeenCalledWith(COURSE_ID, MODULE_ID)
    expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/courses/${COURSE_ID}/content`)
    expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/courses/${COURSE_ID}`)
  })

  it('blocks guest and student users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const guestResult = await deleteModuleAction(COURSE_ID, MODULE_ID)
    expect(guestResult.status).toBe('error')
    expect(guestResult.message).toBe(UNAUTHORIZED_DELETE_MODULE_ERROR)

    mockGetCurrentUser.mockResolvedValue(STUDENT_USER)
    const studentResult = await deleteModuleAction(COURSE_ID, MODULE_ID)
    expect(studentResult.status).toBe('error')
    expect(studentResult.message).toBe(UNAUTHORIZED_DELETE_MODULE_ERROR)
  })

  it('rejects invalid course or module ids', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    const invalidCourse = await deleteModuleAction('bad-id', MODULE_ID)
    expect(invalidCourse.status).toBe('error')
    expect(invalidCourse.message).toBe(INVALID_DELETE_MODULE_REQUEST_ERROR)

    const invalidModule = await deleteModuleAction(COURSE_ID, 'bad-id')
    expect(invalidModule.status).toBe('error')
    expect(invalidModule.message).toBe(INVALID_DELETE_MODULE_REQUEST_ERROR)
  })

  it('maps cross-course delete to invalid request', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteModuleFromCourse.mockRejectedValue(new CourseModuleNotFoundError())

    const result = await deleteModuleAction(COURSE_ID, MODULE_ID)

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_DELETE_MODULE_REQUEST_ERROR)
  })

  it('returns Hebrew message when lessons block deletion', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteModuleFromCourse.mockRejectedValue(
      new CourseValidationError(LESSONS_BLOCK_MESSAGE),
    )

    const result = await deleteModuleAction(COURSE_ID, MODULE_ID)

    expect(result.status).toBe('error')
    expect(result.message).toBe(LESSONS_BLOCK_MESSAGE)
  })

  it('maps deletion failure and count sync errors safely', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteModuleFromCourse.mockRejectedValue(new ModuleDeletionFailedError())

    const failedResult = await deleteModuleAction(COURSE_ID, MODULE_ID)
    expect(failedResult.status).toBe('error')
    expect(failedResult.message).toBe(GENERIC_DELETE_MODULE_ERROR)

    mockDeleteModuleFromCourse.mockRejectedValue(new ModuleCountSyncError())
    const syncResult = await deleteModuleAction(COURSE_ID, MODULE_ID)
    expect(syncResult.status).toBe('error')
    expect(syncResult.message).toBe(MODULE_COUNT_SYNC_ERROR)
  })

  it('does not expose raw mongo errors', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockDeleteModuleFromCourse.mockRejectedValue(new Error('MongoServerError: write conflict'))

    const result = await deleteModuleAction(COURSE_ID, MODULE_ID)

    expect(result.status).toBe('error')
    expect(result.message).toBe(GENERIC_DELETE_MODULE_ERROR)
    expect(result.message).not.toContain('Mongo')
  })
})
