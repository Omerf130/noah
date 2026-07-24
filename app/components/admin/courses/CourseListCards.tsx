import type { AdminCourseListItemDto } from '../../../../lib/courses/mappers/to-admin-course-list-dto'
import CourseStatusBadge from './CourseStatusBadge'
import CourseVisibilityBadge from './CourseVisibilityBadge'
import styles from './CourseList.module.scss'

type CourseListCardsProps = {
  items: AdminCourseListItemDto[]
}

function CardField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.cardField}>
      <span className={styles.cardLabel}>{label}</span>
      <span className={styles.cardValue}>{value}</span>
    </div>
  )
}

export default function CourseListCards({ items }: CourseListCardsProps) {
  return (
    <div className={styles.cards}>
      {items.map((course) => (
        <article key={course.id} className={styles.card}>
          <h2 className={styles.cardTitle}>{course.title}</h2>
          <div className={styles.cardGrid}>
            <CardField label="שם פנימי" value={course.internalName} />
            <CardField label="Slug" value={course.slug} />
            <CardField label="קטגוריה" value={course.categoryLabel ?? '—'} />
            <div className={styles.cardField}>
              <span className={styles.cardLabel}>סטטוס</span>
              <span className={styles.cardValue}>
                <CourseStatusBadge status={course.status} label={course.statusLabel} />
              </span>
            </div>
            <div className={styles.cardField}>
              <span className={styles.cardLabel}>נראות</span>
              <span className={styles.cardValue}>
                <CourseVisibilityBadge
                  visibility={course.visibility}
                  label={course.visibilityLabel}
                />
              </span>
            </div>
            <CardField label="מחיר" value={course.priceLabel} />
            <CardField label="מחיר מבצע" value={course.salePriceLabel ?? '—'} />
            <CardField label="מטבע" value={course.currency} />
            <CardField label="מומלץ" value={course.featuredLabel} />
            <CardField label="פרקים" value={course.moduleCount} />
            <CardField label="שיעורים" value={course.lessonCount} />
            <CardField label="מדריך/ה" value={course.instructorName} />
            <CardField label="נוצר על ידי" value={course.createdByName} />
            <CardField label="נוצר" value={course.createdAtLabel} />
            <CardField label="עודכן" value={course.updatedAtLabel} />
          </div>
        </article>
      ))}
    </div>
  )
}
