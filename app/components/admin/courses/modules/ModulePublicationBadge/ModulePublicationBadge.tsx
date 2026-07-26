import type { PublicationStatus } from '../../../../../../lib/courses/types'
import styles from '../ModuleContent.module.scss'

type ModulePublicationBadgeProps = {
  status: PublicationStatus
  label: string
}

const statusClassMap: Record<PublicationStatus, string> = {
  draft: styles.statusDraft,
  published: styles.statusPublished,
}

export default function ModulePublicationBadge({ status, label }: ModulePublicationBadgeProps) {
  return (
    <span className={[styles.badge, statusClassMap[status]].join(' ')}>
      {label}
    </span>
  )
}
