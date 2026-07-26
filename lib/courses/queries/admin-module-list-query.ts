import { connectDb } from '../../db/connect'
import { Course, CourseModule } from '../../db/models'
import {
  mapToAdminModuleListItemDto,
  type AdminModuleListItemDto,
  type AdminModuleListItemLeanModule,
} from '../mappers/to-admin-module-list-item-dto'
import { parseCourseIdParam } from '../validators/course-id'

const moduleListProjection = {
  title: 1,
  description: 1,
  order: 1,
  publicationStatus: 1,
  lessonCount: 1,
} as const

export type AdminModuleListResult = {
  courseId: string
  items: AdminModuleListItemDto[]
  totalItems: number
}

export async function listAdminCourseModules(courseId: string): Promise<AdminModuleListResult | null> {
  const parsedCourseId = parseCourseIdParam(courseId)
  if (!parsedCourseId.success) {
    return null
  }

  await connectDb()

  const courseExists = await Course.exists({ _id: parsedCourseId.courseId })
  if (!courseExists) {
    return null
  }

  const modules = (await CourseModule.find({ courseId: parsedCourseId.courseId })
    .select(moduleListProjection)
    .sort({ order: 1 })
    .lean()) as AdminModuleListItemLeanModule[]

  return {
    courseId: parsedCourseId.courseId,
    items: modules.map((courseModule, index) =>
      mapToAdminModuleListItemDto(courseModule, index + 1),
    ),
    totalItems: modules.length,
  }
}
