import type { AdminModuleListItemDto } from '../../../../../../lib/courses/mappers/to-admin-module-list-item-dto'
import styles from '../ModuleContent.module.scss'
import ModuleRow from './ModuleRow'

type ModuleListProps = {
  items: AdminModuleListItemDto[]
}

export default function ModuleList({ items }: ModuleListProps) {
  if (items.length === 0) {
    return (
      <section className={styles.emptyState} aria-labelledby="module-empty-title">
        <h2 id="module-empty-title" className={styles.emptyTitle}>
          אין פרקים עדיין
        </h2>
        <p className={styles.emptyText}>
          לקורס זה עדיין לא נוספו פרקים. ניהול יצירה ועריכה יתווסף בשלב הבא.
        </p>
      </section>
    )
  }

  return (
    <section className={styles.moduleList} aria-label="רשימת פרקים">
      {items.map((module) => (
        <ModuleRow key={module.id} module={module} />
      ))}
    </section>
  )
}
