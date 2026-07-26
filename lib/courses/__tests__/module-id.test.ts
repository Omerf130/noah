import { describe, expect, it } from 'vitest'
import { parseModuleIdParam } from '../validators/module-id'

const VALID_OBJECT_ID = '507f1f77bcf86cd799439011'

describe('parseModuleIdParam', () => {
  it('accepts valid ObjectId strings', () => {
    const result = parseModuleIdParam(VALID_OBJECT_ID)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.moduleId).toBe(VALID_OBJECT_ID)
    }
  })

  it('rejects invalid ObjectId strings', () => {
    expect(parseModuleIdParam('not-an-id').success).toBe(false)
    expect(parseModuleIdParam('').success).toBe(false)
    expect(parseModuleIdParam('123').success).toBe(false)
  })
})
