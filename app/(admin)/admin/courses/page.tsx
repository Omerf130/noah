import { requireAdmin } from '../../../../lib/auth/current-user'
import { buildPageMetadata } from '../../../../lib/seo'
import { listAdminCourses } from '../../../../lib/courses/queries/admin-course-list-query'
import {
  hasActiveAdminCourseListFilters,
  parseAdminCourseListParams,
} from '../../../../lib/courses/validators/admin-course-list'
import Button from '../../../components/ui/Button/Button'
import CourseCardGrid from '../../../components/admin/courses/CourseCardGrid'
import CourseListEmptyState from '../../../components/admin/courses/CourseListEmptyState'
import CourseListFilters from '../../../components/admin/courses/CourseListFilters'
import CourseListPagination from '../../../components/admin/courses/CourseListPagination'
import styles from '../../../components/admin/courses/CourseList.module.scss'

export const runtime = 'nodejs'

export const metadata = buildPageMetadata({
  title: 'ניהול קורסים',
  description: 'צפייה וניהול של הקורסים במערכת.',
  path: '/admin/courses',
  noIndex: true,
})

type AdminCoursesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminCoursesPage({ searchParams }: AdminCoursesPageProps) {
  await requireAdmin({ returnTo: '/admin/courses' })

  const resolvedSearchParams = await searchParams
  const params = parseAdminCourseListParams(resolvedSearchParams)
  const result = await listAdminCourses(params)
  const hasFilters = hasActiveAdminCourseListFilters(params)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.title}>ניהול קורסים</h1>
          <p className={styles.lead}>צפייה וניהול של הקורסים במערכת.</p>
        </div>
        <div className={styles.headerActions}>
          <Button href="/admin/courses/new" variant="primary">
            קורס חדש
          </Button>
        </div>
      </header>

      <CourseListFilters params={params} />

      <p className={styles.summary}>
        מציג {result.items.length} מתוך {result.totalItems} קורסים
      </p>

      {result.totalItems === 0 ? (
        <CourseListEmptyState variant={hasFilters ? 'no-results' : 'empty-database'} />
      ) : (
        <>
          <CourseCardGrid items={result.items} />
          <CourseListPagination
            params={params}
            page={result.page}
            totalPages={result.totalPages}
          />
        </>
      )}
    </div>
  )
}
