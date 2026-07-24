import { describe, expect, it } from 'vitest'
import { parseCourseIdParam } from '../validators/course-id'

describe('parseCourseIdParam', () => {
  it('accepts a valid ObjectId', () => {
    const result = parseCourseIdParam('507f1f77bcf86cd799439011')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.courseId).toBe('507f1f77bcf86cd799439011')
    }
  })

  it('rejects invalid ObjectId values', () => {
    expect(parseCourseIdParam('not-an-id').success).toBe(false)
    expect(parseCourseIdParam('').success).toBe(false)
    expect(parseCourseIdParam('507f1f77bcf86cd79943901').success).toBe(false)
  })
})
