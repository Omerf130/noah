import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockCreateLessonInModule = vi.fn()
const mockRevalidatePath = vi.fn()
const mockRedirect = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/lesson-service', () => ({
  createLessonInModule: (...args: unknown[]) => mockCreateLessonInModule(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

import { createLessonAction } from '../actions/create-lesson'
import {
  DUPLICATE_LESSON_IDENTIFIER_ERROR,
  GENERIC_CREATE_LESSON_ERROR,
  INVALID_CREATE_LESSON_REQUEST_ERROR,
  UNAUTHORIZED_CREATE_LESSON_ERROR,
  initialCreateLessonActionState,
} from '../actions/create-lesson-action-state'
import {
  CourseModuleNotFoundError,
  CourseValidationError,
  LessonCountSyncError,
  LessonDuplicateSlugError,
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

function buildFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData()

  const defaults: Record<string, string> = {
    title: 'שיעור חדש',
    description: 'תיאור',
    publicationStatus: 'draft',
    ...overrides,
  }

  for (const [key, value] of Object.entries(defaults)) {
    formData.set(key, value)
  }

  return formData
}

describe('createLessonAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })
  })

  it('creates a lesson for admin users and redirects to module lesson list', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockCreateLessonInModule.mockResolvedValue({ _id: '507f1f77bcf86cd799439031' })

    await expect(
      createLessonAction(
        COURSE_ID,
        MODULE_ID,
        initialCreateLessonActionState,
        buildFormData(),
      ),
    ).rejects.toThrow('NEXT_REDIRECT')

    expect(mockCreateLessonInModule).toHaveBeenCalledWith(COURSE_ID, MODULE_ID, {
      title: 'שיעור חדש',
      description: 'תיאור',
      publicationStatus: 'draft',
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith(
      `/admin/courses/${COURSE_ID}/content/${MODULE_ID}`,
    )
    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/courses/${COURSE_ID}/content/${MODULE_ID}`,
    )
  })

  it('blocks guest and student users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const guestResult = await createLessonAction(
      COURSE_ID,
      MODULE_ID,
      initialCreateLessonActionState,
      buildFormData(),
    )
    expect(guestResult.status).toBe('error')
    expect(guestResult.message).toBe(UNAUTHORIZED_CREATE_LESSON_ERROR)

    mockGetCurrentUser.mockResolvedValue(STUDENT_USER)
    const studentResult = await createLessonAction(
      COURSE_ID,
      MODULE_ID,
      initialCreateLessonActionState,
      buildFormData(),
    )
    expect(studentResult.status).toBe('error')
    expect(studentResult.message).toBe(UNAUTHORIZED_CREATE_LESSON_ERROR)
  })

  it('requires title', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    const result = await createLessonAction(
      COURSE_ID,
      MODULE_ID,
      initialCreateLessonActionState,
      buildFormData({ title: '   ' }),
    )

    expect(result.status).toBe('error')
    expect(result.fieldErrors?.title?.length).toBeGreaterThan(0)
  })

  it('returns invalid request for missing module', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockCreateLessonInModule.mockRejectedValue(new CourseModuleNotFoundError())

    const result = await createLessonAction(
      COURSE_ID,
      MODULE_ID,
      initialCreateLessonActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_CREATE_LESSON_REQUEST_ERROR)
  })

  it('maps duplicate slug errors to Hebrew message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockCreateLessonInModule.mockRejectedValue(new LessonDuplicateSlugError())

    const result = await createLessonAction(
      COURSE_ID,
      MODULE_ID,
      initialCreateLessonActionState,
      buildFormData(),
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(DUPLICATE_LESSON_IDENTIFIER_ERROR)
  })

  it('maps count sync and validation errors to generic create message', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)
    mockCreateLessonInModule.mockRejectedValue(new LessonCountSyncError())

    const countSyncResult = await createLessonAction(
      COURSE_ID,
      MODULE_ID,
      initialCreateLessonActionState,
      buildFormData(),
    )
    expect(countSyncResult.message).toBe(GENERIC_CREATE_LESSON_ERROR)

    mockCreateLessonInModule.mockRejectedValue(new CourseValidationError('invalid'))
    const validationResult = await createLessonAction(
      COURSE_ID,
      MODULE_ID,
      initialCreateLessonActionState,
      buildFormData(),
    )
    expect(validationResult.message).toBe(GENERIC_CREATE_LESSON_ERROR)
  })
})
