import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockUpdateModuleMetadata = vi.fn()
const mockRevalidatePath = vi.fn()
const mockRedirect = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/module-service', () => ({
  updateModuleMetadata: (...args: unknown[]) => mockUpdateModuleMetadata(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

import { updateModuleAction } from '../actions/update-module'
import {
  GENERIC_UPDATE_MODULE_ERROR,
  INVALID_UPDATE_MODULE_REQUEST_ERROR,
  NO_CHANGES_MADE_MESSAGE,
  UNAUTHORIZED_UPDATE_MODULE_ERROR,
  initialUpdateModuleActionState,
} from '../actions/update-module-action-state'
import { CourseModuleNotFoundError } from '../services/errors'

const COURSE_ID = '507f1f77bcf86cd799439011'
const MODULE_ID = '507f1f77bcf86cd799439012'
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
    title: 'פרק מעודכן',
    description: 'תיאור מעודכן',
    publicationStatus: 'published',
    courseId: COURSE_ID,
    moduleId: MODULE_ID,
    ...overrides,
  }

  for (const [key, value] of Object.entries(defaults)) {
    formData.set(key, value)
  }

  return formData
}

describe('updateModuleAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })
  })

  it('updates module metadata for admin users and redirects', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockUpdateModuleMetadata.mockResolvedValue({ updated: true, module: {} })

    await expect(
      updateModuleAction(
        COURSE_ID,
        MODULE_ID,
        initialUpdateModuleActionState,
        buildFormData(),
      ),
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(mockUpdateModuleMetadata).toHaveBeenCalledWith(COURSE_ID, MODULE_ID, {
      title: 'פרק מעודכן',
      description: 'תיאור מעודכן',
      publicationStatus: 'published',
    })
  })

  it('blocks guest and student users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const guestResult = await updateModuleAction(
      COURSE_ID,
      MODULE_ID,
      initialUpdateModuleActionState,
      buildFormData(),
    )
    expect(guestResult.message).toBe(UNAUTHORIZED_UPDATE_MODULE_ERROR)

    mockGetCurrentUser.mockResolvedValue(STUDENT_USER)
    const studentResult = await updateModuleAction(
      COURSE_ID,
      MODULE_ID,
      initialUpdateModuleActionState,
      buildFormData(),
    )
    expect(studentResult.message).toBe(UNAUTHORIZED_UPDATE_MODULE_ERROR)
  })

  it('rejects forged courseId mismatch', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    const result = await updateModuleAction(
      COURSE_ID,
      MODULE_ID,
      initialUpdateModuleActionState,
      buildFormData({ courseId: FOREIGN_COURSE_ID }),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_UPDATE_MODULE_REQUEST_ERROR)
  })

  it('returns no-op state when nothing changed', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockUpdateModuleMetadata.mockResolvedValue({ updated: false, module: {} })

    const result = await updateModuleAction(
      COURSE_ID,
      MODULE_ID,
      initialUpdateModuleActionState,
      buildFormData(),
    )

    expect(result.status).toBe('no-op')
    expect(result.message).toBe(NO_CHANGES_MADE_MESSAGE)
  })

  it('returns safe error for invalid module', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockUpdateModuleMetadata.mockRejectedValue(new CourseModuleNotFoundError())

    const result = await updateModuleAction(
      COURSE_ID,
      MODULE_ID,
      initialUpdateModuleActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_UPDATE_MODULE_REQUEST_ERROR)
  })

  it('ignores forged slug and order fields', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockUpdateModuleMetadata.mockResolvedValue({ updated: true, module: {} })

    await expect(
      updateModuleAction(
        COURSE_ID,
        MODULE_ID,
        initialUpdateModuleActionState,
        buildFormData({ slug: 'new-slug', order: '500' }),
      ),
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(mockUpdateModuleMetadata).toHaveBeenCalledWith(
      COURSE_ID,
      MODULE_ID,
      expect.not.objectContaining({ slug: 'new-slug', order: 500 }),
    )
  })

  it('maps unexpected errors to generic update message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockUpdateModuleMetadata.mockRejectedValue(new Error('boom'))

    const result = await updateModuleAction(
      COURSE_ID,
      MODULE_ID,
      initialUpdateModuleActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(GENERIC_UPDATE_MODULE_ERROR)
  })
})
