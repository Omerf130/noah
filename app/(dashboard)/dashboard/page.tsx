import { getDisplayName } from '../../../lib/app-shell/navigation'
import { requireUser } from '../../../lib/auth/current-user'
import { buildPageMetadata } from '../../../lib/seo'
import styles from '../../components/app-shell/AppPage/AppPage.module.scss'

export const runtime = 'nodejs'

export const metadata = buildPageMetadata({
  title: 'האזור האישי',
  description: 'האזור האישי של נוח.',
  path: '/dashboard',
  noIndex: true,
})

export default async function DashboardPage() {
  const user = await requireUser({ returnTo: '/dashboard' })
  const displayName = getDisplayName(user.fullName)

  return (
    <div className={styles.page}>
      <span className={styles.eyebrow}>מחובר/ת בהצלחה</span>
      <h1 className={styles.title}>שלום, {displayName}</h1>
      <p className={styles.lead}>
        ברוכים הבאים לאזור האישי. כאן יופיעו בהמשך הקורסים שלכם, ההתקדמות ופרטי החשבון.
      </p>

      <section className={styles.card} aria-labelledby="dashboard-empty-state">
        <h2 id="dashboard-empty-state" className={styles.cardTitle}>
          עדיין אין תוכן פעיל
        </h2>
        <p className={styles.text}>
          לאחר רכישה או הרשמה לקורס, הוא יופיע כאן. גם מעקב התקדמות ופרטי פרופיל יתווספו
          בשלבים הבאים.
        </p>
        <ul className={styles.list}>
          <li>הקורסים שלי — יופיעו כאן כשיהיו זמינים</li>
          <li>ההתקדמות שלי — תופיע כאן לאחר שיתווסף קורס פעיל</li>
          <li>הפרופיל שלי — ייפתח בשלב מאוחר יותר</li>
        </ul>
      </section>
    </div>
  )
}
