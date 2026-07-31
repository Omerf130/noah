import type { AdminContentBlockListItemDto } from '../../../../../../lib/courses/mappers/to-admin-content-block-list-item-dto'
import Button from '../../../../ui/Button/Button'
import ContentBlockRowActions from '../ContentBlockRowActions/ContentBlockRowActions'
import RichTextPreview from '../RichTextPreview/RichTextPreview'
import styles from './ContentBlockList.module.scss'

type ContentBlockListProps = {
  courseId: string
  moduleId: string
  lessonId: string
  items: AdminContentBlockListItemDto[]
}

export default function ContentBlockList({
  courseId,
  moduleId,
  lessonId,
  items,
}: ContentBlockListProps) {
  const createHref = `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content/blocks/new`

  if (items.length === 0) {
    return (
      <section className={styles.emptyState} aria-labelledby="content-block-empty-title">
        <h2 id="content-block-empty-title" className={styles.emptyTitle}>
          אין בלוקי תוכן עדיין
        </h2>
        <p className={styles.emptyText}>הוסיפו בלוק טקסט עשיר כדי להתחיל לבנות את תוכן השיעור.</p>
        <div className={styles.emptyActions}>
          <Button href={createHref} variant="primary">
            הוסף בלוק תוכן
          </Button>
        </div>
      </section>
    )
  }

  return (
    <>
      <div className={styles.headerActions}>
        <Button href={createHref} variant="primary">
          הוסף בלוק תוכן
        </Button>
      </div>

      <ol className={styles.blockList} aria-label="בלוקי תוכן בשיעור">
        {items.map((block, index) => {
          const editHref = `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content/blocks/${block.id}/edit`
          const position = index + 1
          const blockLabel = `בלוק ${block.positionLabel}`

          return (
            <li key={block.id}>
              <article className={styles.blockCard} aria-labelledby={`content-block-title-${block.id}`}>
                <div className={styles.blockHeader}>
                  <div className={styles.blockTitleBlock}>
                    <p className={styles.blockPosition}>בלוק {block.positionLabel}</p>
                    <h2 id={`content-block-title-${block.id}`} className={styles.blockType}>
                      {block.typeLabel}
                    </h2>
                  </div>
                  <span className={styles.typeBadge}>{block.typeLabel}</span>
                </div>

                <RichTextPreview
                  html={block.previewHtml}
                  unavailableMessage={block.previewUnavailableMessage}
                />

                <ContentBlockRowActions
                  courseId={courseId}
                  moduleId={moduleId}
                  lessonId={lessonId}
                  blockId={block.id}
                  blockLabel={blockLabel}
                  position={position}
                  totalItems={items.length}
                  editHref={editHref}
                />
              </article>
            </li>
          )
        })}
      </ol>
    </>
  )
}
