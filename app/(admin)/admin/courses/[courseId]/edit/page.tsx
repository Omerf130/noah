import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../../lib/auth/current-user'
import { getAdminCourseForEdit } from '../../../../../../lib/courses/queries/admin-course-edit-query'
import { listInstructorOptions } from '../../../../../../lib/courses/queries/instructor-options-query'
import { buildPageMetadata } from '../../../../../../lib/seo'
import EditCourseForm from '../../../../../components/admin/courses/EditCourseForm/EditCourseForm'
import Button from '../../../../../components/ui/Button/Button'
import styles from '../../../../../components/admin/courses/CreateCourseForm/CreateCourseForm.module.scss'

export const runtime = 'nodejs'

type AdminCourseEditPageProps = {
  params: Promise<{ courseId: string }>
}

export async function generateMetadata({ params }: AdminCourseEditPageProps) {
  const { courseId } = await params

  return buildPageMetadata({
    title: 'עריכת קורס',
    description: 'עריכת פרטי הקורס.',
    path: `/admin/courses/${courseId}/edit`,
    noIndex: true,
  })
}

export default async function AdminCourseEditPage({ params }: AdminCourseEditPageProps) {
  const { courseId } = await params
  await requireAdmin({ returnTo: `/admin/courses/${courseId}/edit` })

  const [course, instructorOptions] = await Promise.all([
    getAdminCourseForEdit(courseId),
    listInstructorOptions(),
  ])

  if (!course) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.backLink}>
          <Button href={`/admin/courses/${course.courseId}`} variant="ghost">
            חזרה לפרטי הקורס
          </Button>
        </div>
        <h1 className={styles.title}>עריכת קורס</h1>
        <p className={styles.lead}>עדכנו את פרטי הקורס. סטטוס, מזהה פנימי ותוכן הקורס אינם ניתנים לעריכה כאן.</p>
      </header>

      <EditCourseForm course={course} instructorOptions={instructorOptions} />
    </div>
  )
}
