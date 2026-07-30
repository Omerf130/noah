import type { AdminLessonListItemDto } from '../../../../../../lib/courses/mappers/to-admin-lesson-list-item-dto'

import type { LessonMoveTargetModule } from '../MoveLessonToModuleModal/MoveLessonToModuleModal'

import LessonPublicationBadge from '../LessonPublicationBadge/LessonPublicationBadge'

import LessonRowActions from '../LessonRowActions/LessonRowActions'

import styles from '../LessonContent.module.scss'



type LessonRowProps = {

  courseId: string

  moduleId: string

  lesson: AdminLessonListItemDto

  position: number

  totalItems: number

  siblingModules: LessonMoveTargetModule[]

}



export default function LessonRow({

  courseId,

  moduleId,

  lesson,

  position,

  totalItems,

  siblingModules,

}: LessonRowProps) {

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



      <LessonRowActions

        courseId={courseId}

        moduleId={moduleId}

        lessonId={lesson.id}

        lessonTitle={lesson.title}

        position={position}

        totalItems={totalItems}

        siblingModules={siblingModules}

      />

    </article>

  )

}

