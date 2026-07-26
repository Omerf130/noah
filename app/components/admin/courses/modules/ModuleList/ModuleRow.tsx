import type { AdminModuleListItemDto } from '../../../../../../lib/courses/mappers/to-admin-module-list-item-dto'
import ModulePublicationBadge from '../ModulePublicationBadge/ModulePublicationBadge'
import ModuleRowActions from '../ModuleRowActions/ModuleRowActions'
import styles from '../ModuleContent.module.scss'

type ModuleRowProps = {
  courseId: string
  module: AdminModuleListItemDto
  position: number
  totalItems: number
}

export default function ModuleRow({ courseId, module, position, totalItems }: ModuleRowProps) {
  return (
    <article className={styles.moduleRow} aria-labelledby={`module-title-${module.id}`}>
      <div className={styles.moduleHeader}>
        <div className={styles.moduleTitleBlock}>
          <h2 id={`module-title-${module.id}`} className={styles.moduleTitle}>
            {module.title}
          </h2>
          {module.description ? (
            <p className={styles.moduleDescription}>{module.description}</p>
          ) : null}
        </div>
        <ModulePublicationBadge
          status={module.publicationStatus}
          label={module.publicationStatusLabel}
        />
      </div>

      <dl className={styles.moduleMeta}>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>מיקום</dt>
          <dd className={styles.metaValue}>{module.positionLabel}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>שיעורים</dt>
          <dd className={styles.metaValue}>{module.lessonCountLabel}</dd>
        </div>
      </dl>

      <ModuleRowActions
        courseId={courseId}
        moduleId={module.id}
        moduleTitle={module.title}
        position={position}
        totalItems={totalItems}
      />
    </article>
  )
}
