'use client'

import styles from '../../../components/admin/courses/CourseList.module.scss'

type AdminCoursesErrorProps = {
  reset: () => void
}

export default function AdminCoursesError({ reset }: AdminCoursesErrorProps) {
  return (
    <div className={styles.emptyState} role="alert">
      <h1 className={styles.emptyTitle}>לא ניתן לטעון את רשימת הקורסים</h1>
      <p className={styles.emptyText}>
        אירעה שגיאה בעת טעינת הנתונים. נסו שוב בעוד רגע.
      </p>
      <button type="button" className={styles.submitButton} onClick={reset}>
        נסו שוב
      </button>
    </div>
  )
}
