import { describe, expect, it } from 'vitest'
import {
  buildAdminCourseListQueryString,
  hasActiveAdminCourseListFilters,
  parseAdminCourseListParams,
} from '../validators/admin-course-list'

describe('parseAdminCourseListParams', () => {
  it('parses search, filters, sort, and page from URL params', () => {
    const result = parseAdminCourseListParams({
      q: ' pharma ',
      status: 'draft',
      visibility: 'private',
      category: 'calculations',
      sort: 'title-asc',
      page: '2',
    })

    expect(result).toEqual({
      q: 'pharma',
      status: 'draft',
      visibility: 'private',
      category: 'calculations',
      sort: 'title-asc',
      page: 2,
    })
  })

  it('falls back safely for invalid sort and page values', () => {
    const result = parseAdminCourseListParams({
      sort: 'invalid-sort',
      page: '0',
    })

    expect(result.sort).toBe('updated-desc')
    expect(result.page).toBe(1)
  })

  it('ignores empty filter values', () => {
    const result = parseAdminCourseListParams({
      status: '',
      visibility: '',
      category: '',
    })

    expect(result.status).toBeUndefined()
    expect(result.visibility).toBeUndefined()
    expect(result.category).toBeUndefined()
  })

  it('does not accept pageSize in the URL', () => {
    const result = parseAdminCourseListParams({
      pageSize: '20',
      page: '2',
    })

    expect(result.page).toBe(2)
    expect('pageSize' in result).toBe(false)
  })
})

describe('buildAdminCourseListQueryString', () => {
  it('preserves filters and page in the query string', () => {
    const query = buildAdminCourseListQueryString(
      {
        q: 'calc',
        status: 'published',
        visibility: 'public',
        sort: 'created-desc',
        page: 2,
      },
      { page: 3 },
    )

    expect(query).toBe('?q=calc&status=published&visibility=public&sort=created-desc&page=3')
  })
})

describe('hasActiveAdminCourseListFilters', () => {
  it('detects active filters', () => {
    expect(hasActiveAdminCourseListFilters({ sort: 'updated-desc', page: 1 })).toBe(false)
    expect(
      hasActiveAdminCourseListFilters({
        q: 'test',
        sort: 'updated-desc',
        page: 1,
      }),
    ).toBe(true)
  })
})
