import Link from 'next/link'
import styles from '../../modules/ModuleContent.module.scss'

type LessonAdminNavProps = {
  courseId: string
  moduleId: string
  lessonId: string
  activeTab: 'details' | 'content'
}

export default function LessonAdminNav({
  courseId,
  moduleId,
  lessonId,
  activeTab,
}: LessonAdminNavProps) {
  const detailsHref = `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/edit`
  const contentHref = `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`

  return (
    <nav className={styles.nav} aria-label="ניווט ניהול שיעור">
      <Link
        href={detailsHref}
        className={activeTab === 'details' ? styles.navLinkActive : styles.navLink}
        aria-current={activeTab === 'details' ? 'page' : undefined}
      >
        פרטי השיעור
      </Link>
      <Link
        href={contentHref}
        className={activeTab === 'content' ? styles.navLinkActive : styles.navLink}
        aria-current={activeTab === 'content' ? 'page' : undefined}
      >
        תוכן השיעור
      </Link>
    </nav>
  )
}
