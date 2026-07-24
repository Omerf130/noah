import { mapToAdminCourseEditDto, type AdminCourseEditDto } from '../mappers/to-admin-course-edit-dto'
import { getAdminCourseLeanById } from './admin-course-details-query'

export async function getAdminCourseForEdit(courseId: string): Promise<AdminCourseEditDto | null> {
  const course = await getAdminCourseLeanById(courseId)

  if (!course) {
    return null
  }

  return mapToAdminCourseEditDto(course)
}
