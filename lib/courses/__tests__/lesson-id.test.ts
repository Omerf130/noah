import { describe, expect, it } from 'vitest'
import { parseLessonIdParam } from '../validators/lesson-id'

const VALID_OBJECT_ID = '507f1f77bcf86cd799439011'

describe('parseLessonIdParam', () => {
  it('accepts valid ObjectId strings', () => {
    const result = parseLessonIdParam(VALID_OBJECT_ID)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.lessonId).toBe(VALID_OBJECT_ID)
    }
  })

  it('rejects invalid ObjectId strings', () => {
    expect(parseLessonIdParam('not-an-id').success).toBe(false)
    expect(parseLessonIdParam('').success).toBe(false)
    expect(parseLessonIdParam('123').success).toBe(false)
  })
})
