import type { AdminCourseListItemDto } from '../../../../lib/courses/mappers/to-admin-course-list-dto'
import CourseStatusBadge from './CourseStatusBadge'
import CourseVisibilityBadge from './CourseVisibilityBadge'
import styles from './CourseList.module.scss'

type CourseCardProps = {
  course: AdminCourseListItemDto
}

function CardField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.cardField}>
      <span className={styles.cardLabel}>{label}</span>
      <span className={styles.cardValue}>{value}</span>
    </div>
  )
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{course.title}</h2>
        {course.featured && <span className={styles.featuredBadge}>קורס מומלץ</span>}
      </div>

      <div className={styles.cardGrid}>
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
            <CourseVisibilityBadge visibility={course.visibility} label={course.visibilityLabel} />
          </span>
        </div>
        <div className={styles.cardField}>
          <span className={styles.cardLabel}>מחיר</span>
          <span className={styles.cardValue}>
            {course.priceDisplay.isFree ? (
              course.priceDisplay.primaryLabel
            ) : course.priceDisplay.regularLabel ? (
              <span className={styles.priceStack}>
                <span>מחיר מבצע: {course.priceDisplay.saleLabel}</span>
                <span className={styles.priceRegular}>
                  מחיר רגיל: {course.priceDisplay.regularLabel}
                </span>
              </span>
            ) : (
              course.priceDisplay.primaryLabel
            )}
          </span>
        </div>
        <CardField label="מדריך/ה" value={course.instructorName} />
        <CardField label="נוצר על ידי" value={course.createdByName} />
        <CardField label="משך משוער" value={course.durationLabel ?? '—'} />
        <CardField label="פרקים" value={course.moduleCount} />
        <CardField label="שיעורים" value={course.lessonCount} />
        <CardField label="עודכן" value={course.updatedAtLabel} />
      </div>
    </article>
  )
}
