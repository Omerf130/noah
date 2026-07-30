import type { AdminLessonListItemDto } from '../../../../../../lib/courses/mappers/to-admin-lesson-list-item-dto'
import styles from '../LessonContent.module.scss'
import LessonRow from './LessonRow'

type LessonListProps = {
  courseId: string
  moduleId: string
  items: AdminLessonListItemDto[]
}

export default function LessonList({ courseId, moduleId, items }: LessonListProps) {
  if (items.length === 0) {
    return (
      <section className={styles.emptyState} aria-labelledby="lesson-empty-title">
        <h2 id="lesson-empty-title" className={styles.emptyTitle}>
          אין שיעורים עדיין
        </h2>
        <p className={styles.emptyText}>בפרק זה אין שיעורים.</p>
      </section>
    )
  }

  return (
    <section className={styles.lessonList} aria-label="רשימת שיעורים">
      {items.map((lesson) => (
        <LessonRow
          key={lesson.id}
          courseId={courseId}
          moduleId={moduleId}
          lesson={lesson}
        />
      ))}
    </section>
  )
}
