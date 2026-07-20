import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'קצת עליי | נוח',
  description: 'נועה — אחות מוסמכת ומלווה סטודנטים לסיעוד. ליווי אישי, שיעורים פרטיים והמלווה הקליני.',
}

export default function AboutPage() {
  return (
    <div className={styles.page} dir="rtl">
      <PageHero
        variant="split"
        eyebrow="קצת עליי"
        title="נועה — אחות, מלווה, ומישהי שמבינה את הדרך"
        subtitle="לאורך לימודי הסיעוד למדתי שהקושי האמיתי הוא לא רק החומר — אלא שגרה, התמדה, וביטחון כשהעומס לא נגמר."
        ctaLabel="בואו נדבר"
      />

      <section className={styles.section}>
        <Container>
          <div className={styles.splitGrid}>
            <div className={styles.portraitWrap}>
              <Image
                src="/pics/noa.jpeg"
                alt="נועה — מייסדת נוח"
                width={420}
                height={500}
                className={styles.portrait}
              />
            </div>
            <div>
              <h2 className={styles.h2}>איך נולדה &quot;נוח&quot;</h2>
              <p className={styles.p}>
                הרבה סטודנטים חכמים נתקלים בקושי לא בגלל חוסר יכולת, אלא בגלל שאין מי
                שיעזור להם לעשות סדר, לבנות דרך שמתאימה להם, ולהמשיך גם כשקשה.
              </p>
              <p className={styles.p}>
                מתוך המקום הזה נולדה גישה שמחברת בין ידע קליני, תרגול, ארגון למידה
                והקשבה למה שקורה בדרך — כדי שלא תצטרכו לעבור את התואר לבד.
              </p>
              <ul className={styles.list}>
                <li>אחות מוסמכת, בוגרת תואר ראשון בסיעוד</li>
                <li>סטודנטית לתואר שני במנהל מערכות בריאות</li>
                <li>מלווה סטודנטים בליווי, שיעורים וחוברת</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.ctaBand}>
        <Container>
          <h2>רוצים לשמוע אם זה מתאים לכם?</h2>
          <Button href="/#contact" variant="secondary">
            לשיחת היכרות
          </Button>
        </Container>
      </section>
    </div>
  )
}
