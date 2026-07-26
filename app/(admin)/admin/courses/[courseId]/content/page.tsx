import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../../lib/auth/current-user'
import { getAdminCourseContentContext } from '../../../../../../lib/courses/queries/admin-course-content-context-query'
import { listAdminCourseModules } from '../../../../../../lib/courses/queries/admin-module-list-query'
import { buildPageMetadata } from '../../../../../../lib/seo'
import CourseAdminNav from '../../../../../components/admin/courses/CourseAdminNav/CourseAdminNav'
import ModuleList from '../../../../../components/admin/courses/modules/ModuleList/ModuleList'
import Button from '../../../../../components/ui/Button/Button'
import styles from '../../../../../components/admin/courses/modules/ModuleContent.module.scss'

export const runtime = 'nodejs'

type AdminCourseContentPageProps = {
  params: Promise<{ courseId: string }>
}

export async function generateMetadata({ params }: AdminCourseContentPageProps) {
  const { courseId } = await params
  const course = await getAdminCourseContentContext(courseId)

  if (!course) {
    return buildPageMetadata({
      title: 'קורס לא נמצא',
      description: 'הקורס המבוקש לא נמצא.',
      path: `/admin/courses/${courseId}/content`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `פרקי הקורס — ${course.title}`,
    description: course.shortDescription,
    path: `/admin/courses/${course.id}/content`,
    noIndex: true,
  })
}

export default async function AdminCourseContentPage({ params }: AdminCourseContentPageProps) {
  const { courseId } = await params
  await requireAdmin({ returnTo: `/admin/courses/${courseId}/content` })

  const [course, moduleList] = await Promise.all([
    getAdminCourseContentContext(courseId),
    listAdminCourseModules(courseId),
  ])

  if (!course || !moduleList) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.backLink}>
          <Button href="/admin/courses" variant="ghost">
            חזרה לרשימת הקורסים
          </Button>
        </div>
        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.lead}>{course.shortDescription}</p>
      </header>

      <CourseAdminNav courseId={course.id} activeTab="content" />

      <div className={styles.headerActions}>
        <Button href={`/admin/courses/${course.id}/content/new`} variant="primary">
          יצירת פרק חדש
        </Button>
      </div>

      <p className={styles.summary}>
        {moduleList.totalItems === 0
          ? 'אין פרקים בקורס זה'
          : `מציג ${moduleList.totalItems} פרקים`}
      </p>

      <ModuleList courseId={course.id} items={moduleList.items} />
    </div>
  )
}
