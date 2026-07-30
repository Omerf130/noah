import { LESSON_SLUG_HELPER_TEXT } from '../../../../../../lib/courses/mappers/to-admin-lesson-edit-dto'
import type { AdminLessonSystemSettingsDto } from '../../../../../../lib/courses/mappers/to-admin-lesson-edit-dto'
import styles from '../../CreateCourseForm/CreateCourseForm.module.scss'

type LessonSystemSettingsProps = {
  settings: AdminLessonSystemSettingsDto
}

export default function LessonSystemSettings({ settings }: LessonSystemSettingsProps) {
  return (
    <section className={styles.systemSection} aria-labelledby="lesson-system-settings-title">
      <h2 id="lesson-system-settings-title" className={styles.systemSectionTitle}>
        הגדרות מערכת
      </h2>
      <div className={styles.systemGrid}>
        <div className={[styles.field, styles.fieldFull].join(' ')}>
          <span className={styles.label}>מזהה מערכת</span>
          <p className={styles.readOnlyValue}>{settings.slug}</p>
          <p className={styles.hint}>{LESSON_SLUG_HELPER_TEXT}</p>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>מיקום</span>
          <p className={styles.readOnlyValue}>{settings.orderLabel}</p>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>בלוקי תוכן</span>
          <p className={styles.readOnlyValue}>{settings.blockCountLabel}</p>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>נוצר</span>
          <p className={styles.readOnlyValue}>{settings.createdAtLabel}</p>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>עודכן</span>
          <p className={styles.readOnlyValue}>{settings.updatedAtLabel}</p>
        </div>
      </div>
    </section>
  )
}
