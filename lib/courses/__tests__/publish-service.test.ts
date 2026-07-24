import { describe, expect, it } from 'vitest'
import { validateCourseForPublish } from '../services/publish-service'

describe('validateCourseForPublish', () => {
  it('is exported for Checkpoint H integration', () => {
    expect(typeof validateCourseForPublish).toBe('function')
  })
})
