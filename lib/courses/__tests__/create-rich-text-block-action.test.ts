import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockGetCurrentUser = vi.fn()
const mockCreateRichTextContentBlock = vi.fn()
const mockRedirect = vi.fn()
const mockRevalidatePath = vi.fn()

vi.mock('../../auth/current-user', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('../services/content-block-service', () => ({
  createRichTextContentBlock: (...args: unknown[]) => mockCreateRichTextContentBlock(...args),
}))

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

import { createRichTextBlockAction } from '../actions/create-rich-text-block'
import {
  INVALID_CREATE_RICH_TEXT_BLOCK_REQUEST_ERROR,
  UNAUTHORIZED_CREATE_RICH_TEXT_BLOCK_ERROR,
} from '../actions/create-rich-text-block-action-state'
import { INVALID_DOCUMENT_MESSAGE } from '../validators/content-block/rich-text-document'

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

const validDocumentJson = JSON.stringify({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'טקסט' }] }],
})

describe('createRichTextBlockAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRedirect.mockImplementation(() => {
      throw new Error('redirect')
    })
  })

  it('blocks guest users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const formData = new FormData()
    formData.set('documentJson', validDocumentJson)

    const result = await createRichTextBlockAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      { status: 'idle' },
      formData,
    )

    expect(result.message).toBe(UNAUTHORIZED_CREATE_RICH_TEXT_BLOCK_ERROR)
  })

  it('preserves editor content and returns validation errors for unsafe links', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    const formData = new FormData()
    formData.set(
      'documentJson',
      JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'bad',
                marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }],
              },
            ],
          },
        ],
      }),
    )

    const result = await createRichTextBlockAction(
      COURSE_ID,
      MODULE_ID,
      LESSON_ID,
      { status: 'idle' },
      formData,
    )

    expect(result.status).toBe('error')
    expect(result.message).toBe(INVALID_DOCUMENT_MESSAGE)
    expect(result.values?.documentJson).toContain('bad')
    expect(mockCreateRichTextContentBlock).not.toHaveBeenCalled()
  })

  it('rejects invalid route ids', async () => {
    mockGetCurrentUser.mockResolvedValue(ADMIN_USER)

    const formData = new FormData()
    formData.set('documentJson', validDocumentJson)

    const result = await createRichTextBlockAction(
      'bad-id',
      MODULE_ID,
      LESSON_ID,
      { status: 'idle' },
      formData,
    )

    expect(result.message).toBe(INVALID_CREATE_RICH_TEXT_BLOCK_REQUEST_ERROR)
  })
})
