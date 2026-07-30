import type { PublicationStatus } from '../../../../../../lib/courses/types'
import styles from '../LessonContent.module.scss'

type LessonPublicationBadgeProps = {
  status: PublicationStatus
  label: string
}

const statusClassMap: Record<PublicationStatus, string> = {
  draft: styles.statusDraft,
  published: styles.statusPublished,
}

export default function LessonPublicationBadge({ status, label }: LessonPublicationBadgeProps) {
  return (
    <span className={[styles.badge, statusClassMap[status]].join(' ')}>
      {label}
    </span>
  )
}
