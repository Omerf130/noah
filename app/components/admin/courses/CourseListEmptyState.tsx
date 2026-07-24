import styles from './CourseList.module.scss'

type CourseListEmptyStateProps = {
  variant: 'empty-database' | 'no-results'
}

export default function CourseListEmptyState({ variant }: CourseListEmptyStateProps) {
  const isEmptyDatabase = variant === 'empty-database'

  return (
    <section className={styles.emptyState} aria-live="polite">
      <h2 className={styles.emptyTitle}>
        {isEmptyDatabase ? 'אין עדיין קורסים במערכת' : 'לא נמצאו קורסים'}
      </h2>
      <p className={styles.emptyText}>
        {isEmptyDatabase
          ? 'ברגע שייווצרו קורסים, הם יופיעו כאן לצפייה וניהול.'
          : 'נסו לשנות את החיפוש או את מסנני הסטטוס, הנראות והקטגוריה.'}
      </p>
    </section>
  )
}
