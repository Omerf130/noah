import Link from 'next/link'
import { COURSE_CATEGORIES, COURSE_STATUSES, COURSE_VISIBILITIES } from '../../../../lib/courses/constants'
import {
  getCourseCategoryLabel,
  getCourseStatusLabel,
  getCourseVisibilityLabel,
} from '../../../../lib/courses/formatters/admin-display'
import {
  ADMIN_COURSE_LIST_SORTS,
  type AdminCourseListParams,
} from '../../../../lib/courses/validators/admin-course-list'
import styles from './CourseList.module.scss'

type CourseListFiltersProps = {
  params: AdminCourseListParams
}

export default function CourseListFilters({ params }: CourseListFiltersProps) {
  return (
    <section className={styles.filters} aria-label="סינון קורסים">
      <form method="get" className={styles.filtersGrid}>
        <div className={[styles.field, styles.fieldWide].join(' ')}>
          <label className={styles.label} htmlFor="course-search">
            חיפוש
          </label>
          <input
            id="course-search"
            name="q"
            type="search"
            defaultValue={params.q ?? ''}
            className={styles.input}
            placeholder="חיפוש לפי כותרת, שם פנימי או slug"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="course-status">
            סטטוס
          </label>
          <select
            id="course-status"
            name="status"
            defaultValue={params.status ?? ''}
            className={styles.select}
          >
            <option value="">הכל</option>
            {COURSE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {getCourseStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="course-visibility">
            נראות
          </label>
          <select
            id="course-visibility"
            name="visibility"
            defaultValue={params.visibility ?? ''}
            className={styles.select}
          >
            <option value="">הכל</option>
            {COURSE_VISIBILITIES.map((visibility) => (
              <option key={visibility} value={visibility}>
                {getCourseVisibilityLabel(visibility)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="course-category">
            קטגוריה
          </label>
          <select
            id="course-category"
            name="category"
            defaultValue={params.category ?? ''}
            className={styles.select}
          >
            <option value="">הכל</option>
            {COURSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {getCourseCategoryLabel(category)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="course-sort">
            מיון
          </label>
          <select
            id="course-sort"
            name="sort"
            defaultValue={params.sort}
            className={styles.select}
          >
            {ADMIN_COURSE_LIST_SORTS.map((sort) => (
              <option key={sort} value={sort}>
                {sort === 'updated-desc' && 'עודכן לאחרונה'}
                {sort === 'updated-asc' && 'עודכן מוקדם יותר'}
                {sort === 'created-desc' && 'נוצר לאחרונה'}
                {sort === 'title-asc' && 'כותרת (א-ת)'}
              </option>
            ))}
          </select>
        </div>

        <div className={[styles.field, styles.actions].join(' ')}>
          <button type="submit" className={styles.submitButton}>
            הצג תוצאות
          </button>
          <Link href="/admin/courses" className={styles.resetLink}>
            נקה סינון
          </Link>
        </div>
      </form>
    </section>
  )
}
