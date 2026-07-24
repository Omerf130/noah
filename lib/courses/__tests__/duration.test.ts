import { describe, expect, it } from 'vitest'
import {
  formatEstimatedDuration,
  hoursToEstimatedMinutes,
  isValidEstimatedDurationHours,
  parseEstimatedDurationHours,
} from '../formatters/duration'

describe('duration formatters', () => {
  it('converts quarter-hour values to integer minutes', () => {
    expect(hoursToEstimatedMinutes(2)).toBe(120)
    expect(hoursToEstimatedMinutes(12.5)).toBe(750)
    expect(hoursToEstimatedMinutes(1.25)).toBe(75)
  })

  it('accepts valid quarter-hour inputs', () => {
    expect(parseEstimatedDurationHours('1.25')).toBe(1.25)
    expect(parseEstimatedDurationHours('1.5')).toBe(1.5)
    expect(parseEstimatedDurationHours('1.75')).toBe(1.75)
  })

  it('rejects negative and invalid precision values', () => {
    expect(parseEstimatedDurationHours('-1')).toBeUndefined()
    expect(parseEstimatedDurationHours('1.3')).toBeUndefined()
    expect(isValidEstimatedDurationHours(1.3)).toBe(false)
  })

  it('allows empty optional values', () => {
    expect(parseEstimatedDurationHours('')).toBeUndefined()
    expect(parseEstimatedDurationHours(undefined)).toBeUndefined()
  })

  it('formats human-readable duration labels', () => {
    expect(formatEstimatedDuration(120)).toBe('כשעתיים')
    expect(formatEstimatedDuration(750)).toBe('כ־12 שעות ו־30 דקות')
    expect(formatEstimatedDuration(null)).toBeNull()
  })
})
