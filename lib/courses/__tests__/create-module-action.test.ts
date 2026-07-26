import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockCreateModule = vi.fn()
const mockRevalidatePath = vi.fn()
const mockRedirect = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/module-service', () => ({
  createModule: (...args: unknown[]) => mockCreateModule(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

import { createModuleAction } from '../actions/create-module'
import {
  DUPLICATE_MODULE_IDENTIFIER_ERROR,
  GENERIC_CREATE_MODULE_ERROR,
  INVALID_CREATE_MODULE_REQUEST_ERROR,
  UNAUTHORIZED_CREATE_MODULE_ERROR,
  initialCreateModuleActionState,
} from '../actions/create-module-action-state'
import {
  CourseDuplicateKeyError,
  CourseNotFoundError,
  CourseValidationError,
} from '../services/errors'

const COURSE_ID = '507f1f77bcf86cd799439011'

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
    title: 'פרק חדש',
    description: 'תיאור',
    publicationStatus: 'draft',
    ...overrides,
  }

  for (const [key, value] of Object.entries(defaults)) {
    formData.set(key, value)
  }

  return formData
}

describe('createModuleAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })
  })

  it('creates a module for admin users and redirects to content', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockCreateModule.mockResolvedValue({ _id: '507f1f77bcf86cd799439031' })

    await expect(
      createModuleAction(COURSE_ID, initialCreateModuleActionState, buildFormData()),
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(mockCreateModule).toHaveBeenCalledWith(COURSE_ID, {
      title: 'פרק חדש',
      description: 'תיאור',
      publicationStatus: 'draft',
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/courses/${COURSE_ID}/content`)
    expect(mockRedirect).toHaveBeenCalledWith(`/admin/courses/${COURSE_ID}/content`)
  })

  it('blocks guest and student users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const guestResult = await createModuleAction(
      COURSE_ID,
      initialCreateModuleActionState,
      buildFormData(),
    )
    expect(guestResult.status).toBe('error')
    expect(guestResult.message).toBe(UNAUTHORIZED_CREATE_MODULE_ERROR)

    mockGetCurrentUser.mockResolvedValue(STUDENT_USER)
    const studentResult = await createModuleAction(
      COURSE_ID,
      initialCreateModuleActionState,
      buildFormData(),
    )
    expect(studentResult.status).toBe('error')
    expect(studentResult.message).toBe(UNAUTHORIZED_CREATE_MODULE_ERROR)
  })

  it('requires title', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    const result = await createModuleAction(
      COURSE_ID,
      initialCreateModuleActionState,
      buildFormData({ title: '   ' }),
    )

    expect(result.status).toBe('error')
    expect(result.fieldErrors?.title?.length).toBeGreaterThan(0)
  })

  it('ignores forged slug in FormData', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockCreateModule.mockResolvedValue({ _id: '507f1f77bcf86cd799439031' })

    await expect(
      createModuleAction(
        COURSE_ID,
        initialCreateModuleActionState,
        buildFormData({ slug: 'forged-slug' }),
      ),
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(mockCreateModule).toHaveBeenCalledWith(
      COURSE_ID,
      expect.not.objectContaining({ slug: 'forged-slug' }),
    )
  })

  it('returns invalid request for missing course', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockCreateModule.mockRejectedValue(new CourseNotFoundError())

    const result = await createModuleAction(
      COURSE_ID,
      initialCreateModuleActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_CREATE_MODULE_REQUEST_ERROR)
  })

  it('maps duplicate slug errors to Hebrew message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockCreateModule.mockRejectedValue(new CourseDuplicateKeyError('unknown'))

    const result = await createModuleAction(
      COURSE_ID,
      initialCreateModuleActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(DUPLICATE_MODULE_IDENTIFIER_ERROR)
  })

  it('maps validation errors to generic create message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockCreateModule.mockRejectedValue(new CourseValidationError('invalid'))

    const result = await createModuleAction(
      COURSE_ID,
      initialCreateModuleActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(GENERIC_CREATE_MODULE_ERROR)
  })
})
