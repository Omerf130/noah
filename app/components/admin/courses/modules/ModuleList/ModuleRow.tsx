import type { AdminModuleListItemDto } from '../../../../../../lib/courses/mappers/to-admin-module-list-item-dto'
import Button from '../../../../ui/Button/Button'
import ModulePublicationBadge from '../ModulePublicationBadge/ModulePublicationBadge'
import styles from '../ModuleContent.module.scss'

type ModuleRowProps = {
  courseId: string
  module: AdminModuleListItemDto
}

export default function ModuleRow({ courseId, module }: ModuleRowProps) {
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

      <div className={styles.moduleRowActions}>
        <Button
          href={`/admin/courses/${courseId}/content/${module.id}/edit`}
          variant="secondary"
        >
          עריכה
        </Button>
      </div>
    </article>
  )
}
