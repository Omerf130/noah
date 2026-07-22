import { getDisplayName } from '../../../lib/app-shell/navigation'
import { requireAdmin } from '../../../lib/auth/current-user'
import { buildPageMetadata } from '../../../lib/seo'
import styles from '../../components/app-shell/AppPage/AppPage.module.scss'

export const runtime = 'nodejs'

export const metadata = buildPageMetadata({
  title: 'ניהול',
  description: 'אזור הניהול של נוח.',
  path: '/admin',
  noIndex: true,
})

export default async function AdminPage() {
  const user = await requireAdmin({ returnTo: '/admin' })
  const displayName = getDisplayName(user.fullName)

  return (
    <div className={[styles.page, styles.adminPage].filter(Boolean).join(' ')}>
      <span className={styles.eyebrow}>אזור ניהול</span>
      <h1 className={styles.title}>שלום, {displayName}</h1>
      <p className={styles.lead}>
        ברוכים הבאים לאזור הניהול. מודולי ניהול המשתמשים, הקורסים, ההזמנות וההגדרות
        יתווספו בשלבים הבאים.
      </p>

      <section className={styles.card} aria-labelledby="admin-empty-state">
        <h2 id="admin-empty-state" className={styles.cardTitle}>
          מודולים יגיעו בקרוב
        </h2>
        <p className={styles.text}>
          בשלב זה אין נתונים, גרפים או פעולות ניהול פעילות. כל פריטי התפריט שסומנו
          כ&apos;בקרוב&apos; ייפתחו ב-checkpoints הבאים.
        </p>
        <ul className={styles.list}>
          <li>ניהול משתמשים</li>
          <li>ניהול קורסים ותוכן</li>
          <li>הזמנות והגדרות</li>
        </ul>
      </section>
    </div>
  )
}
