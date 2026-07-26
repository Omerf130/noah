import Link from 'next/link'
import styles from '../modules/ModuleContent.module.scss'

type CourseAdminNavProps = {
  courseId: string
  activeTab: 'details' | 'content'
}

export default function CourseAdminNav({ courseId, activeTab }: CourseAdminNavProps) {
  const detailsHref = `/admin/courses/${courseId}`
  const contentHref = `/admin/courses/${courseId}/content`

  return (
    <nav className={styles.nav} aria-label="ניווט ניהול קורס">
      <Link
        href={detailsHref}
        className={activeTab === 'details' ? styles.navLinkActive : styles.navLink}
        aria-current={activeTab === 'details' ? 'page' : undefined}
      >
        פרטי הקורס
      </Link>
      <Link
        href={contentHref}
        className={activeTab === 'content' ? styles.navLinkActive : styles.navLink}
        aria-current={activeTab === 'content' ? 'page' : undefined}
      >
        פרקי הקורס
      </Link>
    </nav>
  )
}
