import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { Course, User } from '../../db/models'
import { ADMIN_COURSE_LIST_PAGE_SIZE } from '../constants'
import {
  mapToAdminCourseListDto,
  type AdminCourseListItemDto,
  type AdminCourseListLeanCourse,
} from '../mappers/to-admin-course-list-dto'
import type { AdminCourseListParams, AdminCourseListSort } from '../validators/admin-course-list'

export type AdminCourseListResult = {
  items: AdminCourseListItemDto[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

const courseListProjection = {
  title: 1,
  internalName: 1,
  slug: 1,
  category: 1,
  status: 1,
  visibility: 1,
  pricing: 1,
  featured: 1,
  moduleCount: 1,
  lessonCount: 1,
  estimatedDurationMinutes: 1,
  instructorId: 1,
  createdBy: 1,
  createdAt: 1,
  updatedAt: 1,
} as const

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildCourseFilter(params: AdminCourseListParams): Record<string, unknown> {
  const filter: Record<string, unknown> = {}

  if (params.status) {
    filter.status = params.status
  }

  if (params.visibility) {
    filter.visibility = params.visibility
  }

  if (params.category) {
    filter.category = params.category
  }

  if (params.q) {
    const pattern = escapeRegex(params.q.trim())
    filter.$or = [
      { title: { $regex: pattern, $options: 'i' } },
      { internalName: { $regex: pattern, $options: 'i' } },
      { slug: { $regex: pattern, $options: 'i' } },
    ]
  }

  return filter
}

function buildCourseSort(sort: AdminCourseListSort): Record<string, 1 | -1> {
  switch (sort) {
    case 'updated-asc':
      return { updatedAt: 1 }
    case 'created-desc':
      return { createdAt: -1 }
    case 'title-asc':
      return { title: 1 }
    case 'updated-desc':
    default:
      return { updatedAt: -1 }
  }
}

async function loadUserNamesById(userIds: string[]): Promise<Map<string, string>> {
  if (userIds.length === 0) {
    return new Map()
  }

  const objectIds = userIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id))

  const users = await User.find({ _id: { $in: objectIds } })
    .select({ fullName: 1 })
    .lean()

  return new Map(users.map((user) => [String(user._id), String(user.fullName)]))
}

export async function listAdminCourses(
  params: AdminCourseListParams,
): Promise<AdminCourseListResult> {
  await connectDb()

  const filter = buildCourseFilter(params)
  const sort = buildCourseSort(params.sort)
  const totalItems = await Course.countDocuments(filter)
  const totalPages = Math.max(1, Math.ceil(totalItems / ADMIN_COURSE_LIST_PAGE_SIZE))
  const page = Math.min(Math.max(params.page, 1), totalPages)
  const skip = (page - 1) * ADMIN_COURSE_LIST_PAGE_SIZE

  const courses = (await Course.find(filter)
    .select(courseListProjection)
    .sort(sort)
    .skip(skip)
    .limit(ADMIN_COURSE_LIST_PAGE_SIZE)
    .lean()) as AdminCourseListLeanCourse[]

  const userIds = courses.flatMap((course) => [
    course.instructorId.toString(),
    course.createdBy.toString(),
  ])
  const uniqueUserIds = [...new Set(userIds)]
  const userNamesById = await loadUserNamesById(uniqueUserIds)

  return {
    items: mapToAdminCourseListDto(courses, userNamesById),
    page,
    pageSize: ADMIN_COURSE_LIST_PAGE_SIZE,
    totalItems,
    totalPages,
  }
}
