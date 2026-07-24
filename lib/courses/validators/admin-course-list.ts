import { z } from 'zod'
import { COURSE_CATEGORIES, COURSE_STATUSES, COURSE_VISIBILITIES } from '../constants'

export const ADMIN_COURSE_LIST_SORTS = [
  'updated-desc',
  'updated-asc',
  'created-desc',
  'title-asc',
] as const

export type AdminCourseListSort = (typeof ADMIN_COURSE_LIST_SORTS)[number]

export type AdminCourseListParams = {
  q?: string
  status?: (typeof COURSE_STATUSES)[number]
  visibility?: (typeof COURSE_VISIBILITIES)[number]
  category?: (typeof COURSE_CATEGORIES)[number]
  sort: AdminCourseListSort
  page: number
}

const sortSchema = z
  .enum(ADMIN_COURSE_LIST_SORTS)
  .catch('updated-desc' as AdminCourseListSort)

const pageSchema = z.coerce.number().int().min(1).catch(1)

const adminCourseListParamsSchema = z.object({
  q: z.string().trim().min(1).optional(),
  status: z.enum(COURSE_STATUSES).optional(),
  visibility: z.enum(COURSE_VISIBILITIES).optional(),
  category: z.enum(COURSE_CATEGORIES).optional(),
  sort: sortSchema,
  page: pageSchema,
})

function readParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = searchParams[key]
  if (Array.isArray(value)) {
    return value[0]?.trim() || undefined
  }

  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export function parseAdminCourseListParams(
  searchParams: Record<string, string | string[] | undefined>,
): AdminCourseListParams {
  const parsed = adminCourseListParamsSchema.safeParse({
    q: readParam(searchParams, 'q'),
    status: readParam(searchParams, 'status'),
    visibility: readParam(searchParams, 'visibility'),
    category: readParam(searchParams, 'category'),
    sort: readParam(searchParams, 'sort'),
    page: readParam(searchParams, 'page'),
  })

  if (parsed.success) {
    return parsed.data
  }

  return {
    sort: 'updated-desc',
    page: 1,
  }
}

export function hasActiveAdminCourseListFilters(params: AdminCourseListParams): boolean {
  return Boolean(params.q || params.status || params.visibility || params.category)
}

export function buildAdminCourseListQueryString(
  params: AdminCourseListParams,
  overrides?: Partial<AdminCourseListParams & { page?: number }>,
): string {
  const merged = { ...params, ...overrides }
  const query = new URLSearchParams()

  if (merged.q) {
    query.set('q', merged.q)
  }

  if (merged.status) {
    query.set('status', merged.status)
  }

  if (merged.visibility) {
    query.set('visibility', merged.visibility)
  }

  if (merged.category) {
    query.set('category', merged.category)
  }

  if (merged.sort !== 'updated-desc') {
    query.set('sort', merged.sort)
  }

  if (merged.page > 1) {
    query.set('page', String(merged.page))
  }

  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}
