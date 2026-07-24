import { describe, expect, it } from 'vitest'
import { formatCoursePriceDisplay } from '../formatters/course-pricing-display'

describe('formatCoursePriceDisplay', () => {
  it('shows חינם for zero regular price without sale', () => {
    const display = formatCoursePriceDisplay({ price: 0, currency: 'ILS' })

    expect(display.isFree).toBe(true)
    expect(display.primaryLabel).toBe('חינם')
    expect(display.regularLabel).toBeNull()
    expect(display.saleLabel).toBeNull()
  })

  it('shows only regular price when sale is absent', () => {
    const display = formatCoursePriceDisplay({ price: 299, currency: 'ILS' })

    expect(display.isFree).toBe(false)
    expect(display.primaryLabel).toContain('299')
    expect(display.regularLabel).toBeNull()
    expect(display.saleLabel).toBeNull()
  })

  it('shows sale and regular labels when sale price exists', () => {
    const display = formatCoursePriceDisplay({
      price: 399,
      salePrice: 299,
      currency: 'ILS',
    })

    expect(display.regularLabel).toContain('399')
    expect(display.saleLabel).toContain('299')
    expect(display.primaryLabel).toContain('299')
  })
})
