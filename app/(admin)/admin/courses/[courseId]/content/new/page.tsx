import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../../../lib/auth/current-user'
import { getAdminCourseContentContext } from '../../../../../../../lib/courses/queries/admin-course-content-context-query'
import { buildPageMetadata } from '../../../../../../../lib/seo'
import CourseAdminNav from '../../../../../../components/admin/courses/CourseAdminNav/CourseAdminNav'
import CreateModuleForm from '../../../../../../components/admin/courses/modules/CreateModuleForm/CreateModuleForm'
import Button from '../../../../../../components/ui/Button/Button'
import styles from '../../../../../../components/admin/courses/CreateCourseForm/CreateCourseForm.module.scss'

export const runtime = 'nodejs'

type AdminCreateModulePageProps = {
  params: Promise<{ courseId: string }>
}

export async function generateMetadata({ params }: AdminCreateModulePageProps) {
  const { courseId } = await params
  const course = await getAdminCourseContentContext(courseId)

  if (!course) {
    return buildPageMetadata({
      title: 'קורס לא נמצא',
      description: 'הקורס המבוקש לא נמצא.',
      path: `/admin/courses/${courseId}/content/new`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `יצירת פרק — ${course.title}`,
    description: course.shortDescription,
    path: `/admin/courses/${course.id}/content/new`,
    noIndex: true,
  })
}

export default async function AdminCreateModulePage({ params }: AdminCreateModulePageProps) {
  const { courseId } = await params
  await requireAdmin({ returnTo: `/admin/courses/${courseId}/content/new` })

  const course = await getAdminCourseContentContext(courseId)

  if (!course) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.backLink}>
          <Button href={`/admin/courses/${course.id}/content`} variant="ghost">
            חזרה לפרקי הקורס
          </Button>
        </div>
        <h1 className={styles.title}>יצירת פרק חדש</h1>
        <p className={styles.lead}>{course.title}</p>
      </header>

      <CourseAdminNav courseId={course.id} activeTab="content" />

      <CreateModuleForm courseId={course.id} />
    </div>
  )
}
