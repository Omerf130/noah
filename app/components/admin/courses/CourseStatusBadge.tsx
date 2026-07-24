import type { CourseStatus } from '../../../../lib/courses/types'
import styles from './CourseList.module.scss'

type CourseStatusBadgeProps = {
  status: CourseStatus
  label: string
}

const statusClassMap: Record<CourseStatus, string> = {
  draft: styles.statusDraft,
  published: styles.statusPublished,
  archived: styles.statusArchived,
}

export default function CourseStatusBadge({ status, label }: CourseStatusBadgeProps) {
  return (
    <span className={[styles.badge, statusClassMap[status]].join(' ')}>
      {label}
    </span>
  )
}
