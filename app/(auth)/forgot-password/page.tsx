import Link from 'next/link'
import AuthShell from '../../components/auth/AuthShell/AuthShell'
import Button from '../../components/ui/Button/Button'
import { getContactHref } from '../../../lib/contact'
import { buildPageMetadata } from '../../../lib/seo'
import styles from './page.module.scss'

export const metadata = buildPageMetadata({
  title: 'שחזור סיסמה',
  description: 'מידע על שחזור סיסמה באתר נוח.',
  path: '/forgot-password',
  noIndex: true,
})

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="שחזור סיסמה"
      subtitle="שירות איפוס סיסמה בדוא״ל יופעל בשלב מאוחר יותר. בינתיים ניתן לפנות אלינו לקבלת עזרה."
    >
      <div className={styles.content}>
        <p className={styles.message}>
          כרגע לא ניתן לאפס סיסמה דרך האתר. אם נתקלתם בבעיה בהתחברות, צרו איתנו קשר
          ונשמח לעזור.
        </p>

        <div className={styles.actions}>
          <Button href="/login" variant="primary">
            חזרה להתחברות
          </Button>
          <Button href={getContactHref('general')} variant="secondary">
            צרו קשר
          </Button>
        </div>

        <Link href="/" className={styles.homeLink}>
          חזרה לדף הבית
        </Link>
      </div>
    </AuthShell>
  )
}
