import { describe, expect, it } from 'vitest'
import { matchesCourseDeleteConfirmation } from '../validators/course-delete-confirmation'

describe('matchesCourseDeleteConfirmation', () => {
  it('requires an exact trimmed title match', () => {
    expect(matchesCourseDeleteConfirmation('Course Title', 'Course Title')).toBe(true)
    expect(matchesCourseDeleteConfirmation('Course Title', ' Course Title ')).toBe(true)
    expect(matchesCourseDeleteConfirmation('Course Title', 'Wrong Title')).toBe(false)
  })
})
