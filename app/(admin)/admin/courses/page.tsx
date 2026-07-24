import { requireAdmin } from '../../../../lib/auth/current-user'
import { buildPageMetadata } from '../../../../lib/seo'
import { listAdminCourses } from '../../../../lib/courses/queries/admin-course-list-query'
import {
  hasActiveAdminCourseListFilters,
  parseAdminCourseListParams,
} from '../../../../lib/courses/validators/admin-course-list'
import CourseListCards from '../../../components/admin/courses/CourseListCards'
import CourseListEmptyState from '../../../components/admin/courses/CourseListEmptyState'
import CourseListFilters from '../../../components/admin/courses/CourseListFilters'
import CourseListPagination from '../../../components/admin/courses/CourseListPagination'
import CourseListTable from '../../../components/admin/courses/CourseListTable'
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
        <h1 className={styles.title}>ניהול קורסים</h1>
        <p className={styles.lead}>צפייה וניהול של הקורסים במערכת.</p>
      </header>

      <CourseListFilters params={params} />

      <p className={styles.summary}>
        מציג {result.items.length} מתוך {result.totalItems} קורסים
      </p>

      {result.totalItems === 0 ? (
        <CourseListEmptyState variant={hasFilters ? 'no-results' : 'empty-database'} />
      ) : (
        <>
          <CourseListTable items={result.items} totalItems={result.totalItems} />
          <CourseListCards items={result.items} />
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
