import mongoose from 'mongoose'
import { describe, expect, it } from 'vitest'
import { MODULE_ORDER_GAP } from '../constants'
import { CourseValidationError } from '../services/errors'
import {
  assertBulkWriteMatchedAll,
  buildScopedOrderUpdates,
  validateScopedReorderIds,
} from '../services/reorder-utils'

describe('validateScopedReorderIds', () => {
  const existing = new Set(['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'])

  it('accepts a complete valid reorder payload', () => {
    expect(() =>
      validateScopedReorderIds(
        ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
        existing,
        'module',
      ),
    ).not.toThrow()
  })

  it('rejects duplicate ids', () => {
    expect(() =>
      validateScopedReorderIds(
        ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439011'],
        existing,
        'module',
      ),
    ).toThrow(CourseValidationError)
  })

  it('rejects ids outside the parent scope', () => {
    expect(() =>
      validateScopedReorderIds(
        ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439099'],
        existing,
        'module',
      ),
    ).toThrow(CourseValidationError)
  })

  it('rejects incomplete payloads', () => {
    expect(() =>
      validateScopedReorderIds(['507f1f77bcf86cd799439011'], existing, 'module'),
    ).toThrow(CourseValidationError)
  })
})

describe('buildScopedOrderUpdates', () => {
  it('scopes every update filter to the parent id', () => {
    const courseId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
    const updates = buildScopedOrderUpdates(
      { courseId },
      ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
      MODULE_ORDER_GAP,
    )

    expect(updates).toHaveLength(2)
    expect(updates[0]?.updateOne.filter.courseId).toEqual(courseId)
    expect(updates[0]?.updateOne.update.$set.order).toBe(MODULE_ORDER_GAP)
    expect(updates[1]?.updateOne.update.$set.order).toBe(MODULE_ORDER_GAP * 2)
  })
})

describe('assertBulkWriteMatchedAll', () => {
  it('throws when not every scoped record was updated', () => {
    expect(() => assertBulkWriteMatchedAll(1, 2, 'module')).toThrow(CourseValidationError)
  })
})
