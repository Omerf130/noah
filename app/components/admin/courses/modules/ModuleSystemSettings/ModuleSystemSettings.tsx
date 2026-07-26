import { MODULE_SLUG_HELPER_TEXT } from '../../../../../../lib/courses/mappers/to-admin-module-edit-dto'
import type { AdminModuleSystemSettingsDto } from '../../../../../../lib/courses/mappers/to-admin-module-edit-dto'
import styles from '../../CreateCourseForm/CreateCourseForm.module.scss'

type ModuleSystemSettingsProps = {
  settings: AdminModuleSystemSettingsDto
}

export default function ModuleSystemSettings({ settings }: ModuleSystemSettingsProps) {
  return (
    <section className={styles.systemSection} aria-labelledby="module-system-settings-title">
      <h2 id="module-system-settings-title" className={styles.systemSectionTitle}>
        הגדרות מערכת
      </h2>
      <div className={styles.systemGrid}>
        <div className={[styles.field, styles.fieldFull].join(' ')}>
          <span className={styles.label}>מזהה מערכת</span>
          <p className={styles.readOnlyValue}>{settings.slug}</p>
          <p className={styles.hint}>{MODULE_SLUG_HELPER_TEXT}</p>
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
