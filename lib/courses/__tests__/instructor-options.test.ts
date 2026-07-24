import { describe, expect, it } from 'vitest'
import {
  assertInstructorOptionDtoSafety,
  getInstructorOptionLabel,
  mapToInstructorOptionDtos,
} from '../mappers/to-instructor-option-dto'

describe('instructor option DTO mapping', () => {
  it('uses fullName only when names are unique', () => {
    const options = mapToInstructorOptionDtos([
      {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        fullName: 'Noah Admin',
        email: 'noah@example.com',
      },
      {
        _id: { toString: () => '507f1f77bcf86cd799439012' },
        fullName: 'Other Admin',
        email: 'other@example.com',
      },
    ])

    expect(options).toEqual([
      { id: '507f1f77bcf86cd799439011', fullName: 'Noah Admin' },
      { id: '507f1f77bcf86cd799439012', fullName: 'Other Admin' },
    ])
    expect(getInstructorOptionLabel(options[0])).toBe('Noah Admin')
  })

  it('adds disambiguation labels only for duplicate visible names', () => {
    const options = mapToInstructorOptionDtos([
      {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        fullName: 'Admin User',
        email: 'first@example.com',
      },
      {
        _id: { toString: () => '507f1f77bcf86cd799439012' },
        fullName: 'Admin User',
        email: 'second@example.com',
      },
      {
        _id: { toString: () => '507f1f77bcf86cd799439013' },
        fullName: 'Unique Admin',
        email: 'unique@example.com',
      },
    ])

    expect(options[0].disambiguationLabel).toBe('first@example.com')
    expect(options[1].disambiguationLabel).toBe('second@example.com')
    expect(options[2].disambiguationLabel).toBeUndefined()
    expect(getInstructorOptionLabel(options[0])).toBe('Admin User (first@example.com)')
    expect(getInstructorOptionLabel(options[2])).toBe('Unique Admin')
  })

  it('rejects unsafe DTO fields', () => {
    const dto = {
      id: '507f1f77bcf86cd799439011',
      fullName: 'Admin User',
      passwordHash: 'secret',
    }

    expect(() => assertInstructorOptionDtoSafety(dto as never)).toThrow(
      'Unsafe instructor option DTO field: passwordHash',
    )
  })
})
