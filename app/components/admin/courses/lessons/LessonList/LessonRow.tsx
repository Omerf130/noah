import type { AdminLessonListItemDto } from '../../../../../../lib/courses/mappers/to-admin-lesson-list-item-dto'
import Button from '../../../../ui/Button/Button'
import LessonPublicationBadge from '../LessonPublicationBadge/LessonPublicationBadge'
import styles from '../LessonContent.module.scss'

type LessonRowProps = {
  courseId: string
  moduleId: string
  lesson: AdminLessonListItemDto
}

export default function LessonRow({ courseId, moduleId, lesson }: LessonRowProps) {
  return (
    <article className={styles.lessonRow} aria-labelledby={`lesson-title-${lesson.id}`}>
      <div className={styles.lessonHeader}>
        <div className={styles.lessonTitleBlock}>
          <h2 id={`lesson-title-${lesson.id}`} className={styles.lessonTitle}>
            {lesson.title}
          </h2>
          {lesson.description ? (
            <p className={styles.lessonDescription}>{lesson.description}</p>
          ) : null}
        </div>
        <LessonPublicationBadge
          status={lesson.publicationStatus}
          label={lesson.publicationStatusLabel}
        />
      </div>

      <dl className={styles.lessonMeta}>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>מיקום</dt>
          <dd className={styles.metaValue}>{lesson.positionLabel}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>בלוקי תוכן</dt>
          <dd className={styles.metaValue}>{lesson.blockCountLabel}</dd>
        </div>
      </dl>

      <div className={styles.lessonRowActions}>
        <Button
          href={`/admin/courses/${courseId}/content/${moduleId}/lessons/${lesson.id}/edit`}
          variant="ghost"
        >
          עריכה
        </Button>
      </div>
    </article>
  )
}
