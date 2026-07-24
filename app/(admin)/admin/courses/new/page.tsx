import { requireAdmin } from '../../../../../lib/auth/current-user'
import { listInstructorOptions } from '../../../../../lib/courses/queries/instructor-options-query'
import { buildPageMetadata } from '../../../../../lib/seo'
import CreateCourseForm from '../../../../components/admin/courses/CreateCourseForm/CreateCourseForm'
import Button from '../../../../components/ui/Button/Button'
import styles from '../../../../components/admin/courses/CreateCourseForm/CreateCourseForm.module.scss'

export const runtime = 'nodejs'

export const metadata = buildPageMetadata({
  title: 'יצירת קורס חדש',
  description: 'הגדירו את פרטי הקורס הבסיסיים. ניתן יהיה להוסיף פרקים ושיעורים בשלבים הבאים.',
  path: '/admin/courses/new',
  noIndex: true,
})

export default async function AdminCreateCoursePage() {
  const admin = await requireAdmin({ returnTo: '/admin/courses/new' })
  const instructorOptions = await listInstructorOptions()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.backLink}>
          <Button href="/admin/courses" variant="ghost">
            חזרה לרשימת הקורסים
          </Button>
        </div>
        <h1 className={styles.title}>יצירת קורס חדש</h1>
        <p className={styles.lead}>
          הגדירו את פרטי הקורס הבסיסיים. ניתן יהיה להוסיף פרקים ושיעורים בשלבים הבאים.
        </p>
      </header>

      <CreateCourseForm
        instructorOptions={instructorOptions}
        defaultInstructorId={admin.id}
      />
    </div>
  )
}
