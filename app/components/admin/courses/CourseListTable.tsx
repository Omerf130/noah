import type { AdminCourseListItemDto } from '../../../../lib/courses/mappers/to-admin-course-list-dto'
import CourseStatusBadge from './CourseStatusBadge'
import CourseVisibilityBadge from './CourseVisibilityBadge'
import styles from './CourseList.module.scss'

type CourseListTableProps = {
  items: AdminCourseListItemDto[]
  totalItems: number
}

export default function CourseListTable({ items, totalItems }: CourseListTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>
          {totalItems} קורסים נמצאו במערכת
        </caption>
        <thead>
          <tr>
            <th scope="col">כותרת</th>
            <th scope="col">שם פנימי</th>
            <th scope="col">Slug</th>
            <th scope="col">קטגוריה</th>
            <th scope="col">סטטוס</th>
            <th scope="col">נראות</th>
            <th scope="col">מחיר</th>
            <th scope="col">מחיר מבצע</th>
            <th scope="col">מטבע</th>
            <th scope="col">מומלץ</th>
            <th scope="col">פרקים</th>
            <th scope="col">שיעורים</th>
            <th scope="col">מדריך/ה</th>
            <th scope="col">נוצר על ידי</th>
            <th scope="col">נוצר</th>
            <th scope="col">עודכן</th>
          </tr>
        </thead>
        <tbody>
          {items.map((course) => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.internalName}</td>
              <td>{course.slug}</td>
              <td>{course.categoryLabel ?? '—'}</td>
              <td>
                <CourseStatusBadge status={course.status} label={course.statusLabel} />
              </td>
              <td>
                <CourseVisibilityBadge
                  visibility={course.visibility}
                  label={course.visibilityLabel}
                />
              </td>
              <td>{course.priceLabel}</td>
              <td>{course.salePriceLabel ?? '—'}</td>
              <td>{course.currency}</td>
              <td>{course.featuredLabel}</td>
              <td>{course.moduleCount}</td>
              <td>{course.lessonCount}</td>
              <td>{course.instructorName}</td>
              <td>{course.createdByName}</td>
              <td>
                <time dateTime={course.createdAt}>{course.createdAtLabel}</time>
              </td>
              <td>
                <time dateTime={course.updatedAt}>{course.updatedAtLabel}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
