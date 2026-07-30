import { describe, expect, it } from 'vitest'
import { parseLessonMoveDirection } from '../validators/admin-move-lesson'

describe('admin move lesson validator', () => {
  it('accepts up and down directions', () => {
    expect(parseLessonMoveDirection('up').success).toBe(true)
    expect(parseLessonMoveDirection('down').success).toBe(true)
  })

  it('rejects invalid directions', () => {
    expect(parseLessonMoveDirection('sideways').success).toBe(false)
    expect(parseLessonMoveDirection('').success).toBe(false)
  })
})
