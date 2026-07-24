'use client'

import type { CourseStatus } from '../../../../../lib/courses/types'
import Button from '../../../ui/Button/Button'
import ArchiveButton from '../ArchiveButton/ArchiveButton'
import DeleteButton from '../DeleteButton/DeleteButton'
import styles from '../CourseList.module.scss'

type CourseActionsProps = {
  courseId: string
  courseTitle: string
  status: CourseStatus
  layout?: 'card' | 'details'
  showNavigationLinks?: boolean
}

export default function CourseActions({
  courseId,
  courseTitle,
  status,
  layout = 'card',
  showNavigationLinks = true,
}: CourseActionsProps) {
  const containerClassName =
    layout === 'details' ? styles.detailsActions : styles.cardActions

  return (
    <div className={containerClassName}>
      {showNavigationLinks && (
        <>
          <Button href={`/admin/courses/${courseId}`} variant="ghost">
            צפייה
          </Button>
          <Button href={`/admin/courses/${courseId}/edit`} variant="secondary">
            עריכה
          </Button>
        </>
      )}
      <ArchiveButton courseId={courseId} status={status} />
      <DeleteButton courseId={courseId} courseTitle={courseTitle} />
    </div>
  )
}
