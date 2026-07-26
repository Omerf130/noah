import { connectDb } from '../../db/connect'
import { CourseModule } from '../../db/models'
import {
  mapToAdminModuleEditDto,
  type AdminModuleEditDto,
  type AdminModuleEditLeanModule,
} from '../mappers/to-admin-module-edit-dto'
import { parseCourseIdParam } from '../validators/course-id'
import { parseModuleIdParam } from '../validators/module-id'

const moduleEditProjection = {
  courseId: 1,
  title: 1,
  slug: 1,
  description: 1,
  publicationStatus: 1,
  createdAt: 1,
  updatedAt: 1,
} as const

export async function getAdminModuleEdit(
  courseId: string,
  moduleId: string,
): Promise<AdminModuleEditDto | null> {
  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)

  if (!parsedCourseId.success || !parsedModuleId.success) {
    return null
  }

  await connectDb()

  const courseModule = (await CourseModule.findById(parsedModuleId.moduleId)
    .select(moduleEditProjection)
    .lean()) as AdminModuleEditLeanModule | null

  if (!courseModule) {
    return null
  }

  if (String(courseModule.courseId) !== parsedCourseId.courseId) {
    return null
  }

  return mapToAdminModuleEditDto(parsedCourseId.courseId, courseModule)
}
