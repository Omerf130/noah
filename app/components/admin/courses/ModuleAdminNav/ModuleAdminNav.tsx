import Link from 'next/link'
import styles from '../modules/ModuleContent.module.scss'

type ModuleAdminNavProps = {
  courseId: string
  moduleId: string
  activeTab: 'details' | 'lessons'
}

export default function ModuleAdminNav({ courseId, moduleId, activeTab }: ModuleAdminNavProps) {
  const detailsHref = `/admin/courses/${courseId}/content/${moduleId}/edit`
  const lessonsHref = `/admin/courses/${courseId}/content/${moduleId}`

  return (
    <nav className={styles.nav} aria-label="ניווט ניהול פרק">
      <Link
        href={detailsHref}
        className={activeTab === 'details' ? styles.navLinkActive : styles.navLink}
        aria-current={activeTab === 'details' ? 'page' : undefined}
      >
        פרטי הפרק
      </Link>
      <Link
        href={lessonsHref}
        className={activeTab === 'lessons' ? styles.navLinkActive : styles.navLink}
        aria-current={activeTab === 'lessons' ? 'page' : undefined}
      >
        שיעורים
      </Link>
    </nav>
  )
}
