import type { CourseVisibility } from '../../../../lib/courses/types'
import styles from './CourseList.module.scss'

type CourseVisibilityBadgeProps = {
  visibility: CourseVisibility
  label: string
}

const visibilityClassMap: Record<CourseVisibility, string> = {
  public: styles.visibilityPublic,
  private: styles.visibilityPrivate,
  members: styles.visibilityMembers,
  unlisted: styles.visibilityUnlisted,
}

export default function CourseVisibilityBadge({
  visibility,
  label,
}: CourseVisibilityBadgeProps) {
  return (
    <span className={[styles.badge, visibilityClassMap[visibility]].join(' ')}>
      {label}
    </span>
  )
}
