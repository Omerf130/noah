import type { Metadata } from 'next'
import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'ליווי אישי לסטודנטים לסיעוד | נוח',
  description: 'תהליך מובנה של 6 מפגשים — שגרה, התמדה וביטחון בדרך להצלחה.',
}

const sessions = [
  'מיפוי, מטרות ונקודת פתיחה',
  'בניית שגרה ולו"ז ריאלי',
  'משמעת עצמית והתמדה',
  'למידה יעילה והכנה למבחנים',
  'ביטחון והתמודדות עם עומס',
  'סיכום ותוכנית המשך',
]

export default function PrivateProcessPage() {
  return (
    <div className={styles.page} dir="rtl">
      <PageHero
        variant="journey"
        eyebrow="ליווי אישי"
        title="6 מפגשים שבונים לכם דרך יציבה"
        subtitle="תהליך מובנה לסטודנטים שמבינים את החומר — אבל צריכים עזרה בשגרה, התמדה וביטחון."
        stat="6"
        ctaLabel="לבירור התאמה"
      />

      <section className={styles.pain}>
        <Container>
          <h2>מתאים לכם אם…</h2>
          <div className={styles.tags}>
            {['קשה לשמור שגרה', 'עומס ודחיינות', 'ירידות מוטיבציה', 'לחץ לפני מבחנים', 'רוצים מסגרת תומכת'].map(
              (t) => (
                <span key={t}>{t}</span>
              )
            )}
          </div>
        </Container>
      </section>

      <section className={styles.roadmap}>
        <Container>
          <h2 className={styles.sectionTitle}>מסלול המפגשים</h2>
          <ol className={styles.list}>
            {sessions.map((s, i) => (
              <li key={s}>
                <span className={styles.num}>{i + 1}</span>
                <p>{s}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className={styles.cta}>
        <Container>
          <Button href="/#contact" variant="secondary">
            לבירור התאמה
          </Button>
        </Container>
      </section>
    </div>
  )
}
