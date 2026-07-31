import { describe, expect, it } from 'vitest'
import {
  resolveTransitionalBlockCount,
  type LessonBlockCountSource,
} from '../services/content-block-counts'

describe('content block transitional counts', () => {
  it('prefers ContentBlock count when content blocks exist', () => {
    const result = resolveTransitionalBlockCount({
      contentBlockCount: 3,
      legacyBlockCount: 2,
    })

    expect(result).toEqual({ count: 3, source: 'contentBlock' satisfies LessonBlockCountSource })
  })

  it('falls back to legacy embedded count when no ContentBlock documents exist', () => {
    const result = resolveTransitionalBlockCount({
      contentBlockCount: 0,
      legacyBlockCount: 2,
    })

    expect(result).toEqual({ count: 2, source: 'legacyEmbedded' satisfies LessonBlockCountSource })
  })

  it('returns zero when neither new nor legacy content exists', () => {
    const result = resolveTransitionalBlockCount({
      contentBlockCount: 0,
      legacyBlockCount: 0,
    })

    expect(result).toEqual({ count: 0, source: 'legacyEmbedded' })
  })

  it('does not add legacy and ContentBlock counts together', () => {
    const result = resolveTransitionalBlockCount({
      contentBlockCount: 2,
      legacyBlockCount: 5,
    })

    expect(result.count).toBe(2)
    expect(result.count).not.toBe(7)
  })
})
