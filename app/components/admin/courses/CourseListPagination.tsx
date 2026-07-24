import Link from 'next/link'
import {
  buildAdminCourseListQueryString,
  type AdminCourseListParams,
} from '../../../../lib/courses/validators/admin-course-list'
import styles from './CourseList.module.scss'

type CourseListPaginationProps = {
  params: AdminCourseListParams
  page: number
  totalPages: number
}

export default function CourseListPagination({
  params,
  page,
  totalPages,
}: CourseListPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className={styles.pagination} aria-label="דפדוף קורסים">
      <Link
        href={`/admin/courses${buildAdminCourseListQueryString(params, { page: Math.max(page - 1, 1) })}`}
        className={page <= 1 ? styles.pageLinkDisabled : styles.pageLink}
        aria-disabled={page <= 1}
      >
        הקודם
      </Link>

      {pages.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={`/admin/courses${buildAdminCourseListQueryString(params, { page: pageNumber })}`}
          className={pageNumber === page ? styles.pageLinkActive : styles.pageLink}
          aria-current={pageNumber === page ? 'page' : undefined}
        >
          {pageNumber}
        </Link>
      ))}

      <Link
        href={`/admin/courses${buildAdminCourseListQueryString(params, { page: Math.min(page + 1, totalPages) })}`}
        className={page >= totalPages ? styles.pageLinkDisabled : styles.pageLink}
        aria-disabled={page >= totalPages}
      >
        הבא
      </Link>
    </nav>
  )
}
