import type { AdminCourseDetailsDto } from '../../../../../lib/courses/mappers/to-admin-course-details-dto'
import { INTERNAL_NAME_HELPER_TEXT } from '../../../../../lib/courses/mappers/to-admin-course-details-dto'
import CourseStatusBadge from '../CourseStatusBadge'
import CourseVisibilityBadge from '../CourseVisibilityBadge'
import styles from './CourseDetails.module.scss'

type CourseDetailsProps = {
  course: AdminCourseDetailsDto
}

function DetailField({
  label,
  value,
  fullWidth = false,
}: {
  label: string
  value: string | number
  fullWidth?: boolean
}) {
  return (
    <div className={[styles.field, fullWidth ? styles.fieldFull : ''].filter(Boolean).join(' ')}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}

export default function CourseDetails({ course }: CourseDetailsProps) {
  return (
    <div className={styles.sections}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>פרטי הקורס</h2>
        <div className={styles.grid}>
          <DetailField label="שם הקורס" value={course.title} fullWidth />
          <DetailField label="תיאור קצר" value={course.shortDescription} fullWidth />
          <DetailField label="קטגוריה" value={course.categoryLabel ?? '—'} />
          <div className={styles.field}>
            <span className={styles.label}>סטטוס</span>
            <span className={styles.value}>
              <CourseStatusBadge status={course.status} label={course.statusLabel} />
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>נראות</span>
            <span className={styles.value}>
              <CourseVisibilityBadge visibility={course.visibility} label={course.visibilityLabel} />
            </span>
          </div>
          <DetailField label="רמת קושי" value={course.difficultyLabel ?? '—'} />
          <DetailField label="קורס מומלץ" value={course.featuredLabel} />
          <DetailField label="משך משוער" value={course.durationLabel ?? '—'} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>תמחור</h2>
        <div className={styles.grid}>
          <div className={[styles.field, styles.fieldFull].join(' ')}>
            <span className={styles.label}>מחיר</span>
            <span className={styles.value}>
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
          <DetailField label="מטבע" value={course.currency} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>צוות ומעקב</h2>
        <div className={styles.grid}>
          <DetailField label="מדריך/ה" value={course.instructorName} />
          <DetailField label="נוצר על ידי" value={course.createdByName} />
          <DetailField label="פרקים" value={course.moduleCount} />
          <DetailField label="שיעורים" value={course.lessonCount} />
          <DetailField label="נוצר" value={course.createdAtLabel} />
          <DetailField label="עודכן" value={course.updatedAtLabel} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>הגדרות מערכת</h2>
        <div className={styles.grid}>
          <DetailField label="מזהה פנימי" value={course.internalName} fullWidth />
          <div className={[styles.field, styles.fieldFull].join(' ')}>
            <DetailField label="כתובת הקורס" value={course.slug} fullWidth />
            <p className={styles.helper}>{INTERNAL_NAME_HELPER_TEXT}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
