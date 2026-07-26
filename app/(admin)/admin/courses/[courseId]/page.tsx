import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../lib/auth/current-user'
import { getAdminCourseDetails } from '../../../../../lib/courses/queries/admin-course-details-query'
import { buildPageMetadata } from '../../../../../lib/seo'
import CourseActions from '../../../../components/admin/courses/CourseActions/CourseActions'
import CourseAdminNav from '../../../../components/admin/courses/CourseAdminNav/CourseAdminNav'
import CourseDetails from '../../../../components/admin/courses/CourseDetails/CourseDetails'
import Button from '../../../../components/ui/Button/Button'
import styles from '../../../../components/admin/courses/CourseDetails/CourseDetails.module.scss'

export const runtime = 'nodejs'

type AdminCourseDetailsPageProps = {
  params: Promise<{ courseId: string }>
}

export async function generateMetadata({ params }: AdminCourseDetailsPageProps) {
  const { courseId } = await params
  const course = await getAdminCourseDetails(courseId)

  if (!course) {
    return buildPageMetadata({
      title: 'קורס לא נמצא',
      description: 'הקורס המבוקש לא נמצא.',
      path: `/admin/courses/${courseId}`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: course.title,
    description: course.shortDescription,
    path: `/admin/courses/${course.id}`,
    noIndex: true,
  })
}

export default async function AdminCourseDetailsPage({ params }: AdminCourseDetailsPageProps) {
  const { courseId } = await params
  await requireAdmin({ returnTo: `/admin/courses/${courseId}` })

  const course = await getAdminCourseDetails(courseId)

  if (!course) {
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

      <div className={styles.actions}>
        <Button href={`/admin/courses/${course.id}/edit`} variant="primary">
          עריכת הקורס
        </Button>
        <Button href={`/admin/courses/${course.id}/content`} variant="secondary">
          ניהול פרקי הקורס
        </Button>
        <CourseActions
          courseId={course.id}
          courseTitle={course.title}
          status={course.status}
          layout="details"
          showNavigationLinks={false}
        />
      </div>

      <CourseAdminNav courseId={course.id} activeTab="details" />

      <CourseDetails course={course} />
    </div>
  )
}
