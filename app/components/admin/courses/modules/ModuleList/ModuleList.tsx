import type { AdminModuleListItemDto } from '../../../../../../lib/courses/mappers/to-admin-module-list-item-dto'
import Button from '../../../../ui/Button/Button'
import styles from '../ModuleContent.module.scss'
import ModuleRow from './ModuleRow'

type ModuleListProps = {
  courseId: string
  items: AdminModuleListItemDto[]
}

export default function ModuleList({ courseId, items }: ModuleListProps) {
  if (items.length === 0) {
    return (
      <section className={styles.emptyState} aria-labelledby="module-empty-title">
        <h2 id="module-empty-title" className={styles.emptyTitle}>
          אין פרקים עדיין
        </h2>
        <p className={styles.emptyText}>התחילו ביצירת הפרק הראשון לקורס זה.</p>
        <div className={styles.emptyAction}>
          <Button href={`/admin/courses/${courseId}/content/new`} variant="primary">
            יצירת פרק חדש
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.moduleList} aria-label="רשימת פרקים">
      {items.map((module) => (
        <ModuleRow key={module.id} courseId={courseId} module={module} />
      ))}
    </section>
  )
}
