import type { Metadata } from 'next'
import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'שיעורים פרטיים בסיעוד | נוח',
  description: 'שיעורים ממוקדים בזום — הסברים, תרגול חכם והכנה למבחנים.',
}

const topics = ['יסודות הסיעוד', 'אנטומיה', 'כימיה', 'סיעוד פנימי', 'סיעוד כירורגי', 'בריאות הנפש', 'גריאטריה', 'ועוד…']

const steps = [
  { title: 'שולחים נושא מראש', text: 'מומלץ — כדי למקד את השיעור.' },
  { title: 'מפגש זום של 60 דקות', text: 'עבודה ממוקדת, מותאמת אליכם.' },
  { title: 'הסברים ודוגמאות', text: 'צעד אחר צעד, בקצב שלכם.' },
  { title: 'תרגול חכם', text: 'לא רק לעבור על החומר — להבין לעומק.' },
  { title: 'תרגול להמשך', text: 'יוצאים עם כיוון ברור לבד.' },
]

export default function PrivateLessonsPage() {
  return (
    <div className={styles.page} dir="rtl">
      <PageHero
        variant="focus"
        eyebrow="שיעורים פרטיים"
        title="שיעור אחד שעושה סדר בראש"
        subtitle="מפגש ממוקד בזום — הסברים ברורים, תרגול משותף, והכנה למבחנים בלי להישבר."
        ctaLabel="לתיאום שיעור"
      />

      <section className={styles.chips}>
        <Container>
          <h2>נושאים ומקצועות</h2>
          <div className={styles.cloud}>
            {topics.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.steps}>
        <Container>
          <h2>איך שיעור נראה בפועל</h2>
          <div className={styles.grid}>
            {steps.map((step, i) => (
              <article key={step.title}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.cta}>
        <Container>
          <Button href="/#contact" variant="primary">
            לתיאום שיעור פרטי
          </Button>
        </Container>
      </section>
    </div>
  )
}
