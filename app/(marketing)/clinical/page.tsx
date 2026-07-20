import type { Metadata } from 'next'
import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import BookFrame from '../../components/marketing/BookFrame/BookFrame'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'נוח – המלווה הקליני | ליווי סטודנטים לסיעוד',
  description: 'המלווה הקליני — חוברת תהליכים אישית לסטודנטים לסיעוד.',
}

const features = [
  { title: 'טיפים ללמידה יעילה', text: 'כלים פרקטיים ללמידה, זכירה וארגון חומר.' },
  { title: 'הכנה למבחנים', text: 'דפי עבודה ותהליכים מובנים להכנה בלי להישבר.' },
  { title: 'רפלקציה אישית', text: 'מרחב לעיבוד חוויות מהקליניקה ומהלימודים.' },
  { title: 'מעקב והתקדמות', text: 'כלים למטרות, הצלחות קטנות, ומסלול ברור.' },
  { title: 'השראה שבועית', text: 'תוכן שמחזק מוטיבציה וחיבור למקצוע.' },
  { title: 'חשיבה קלינית', text: 'שאלות ותובנות ממפגשים בשטח.' },
]

export default function ClinicalPage() {
  return (
    <div className={styles.page} dir="rtl">
      <PageHero
        variant="product"
        eyebrow="המלווה הקליני"
        title="חוברת שמלווה אתכם לאורך כל התואר"
        subtitle="תהליך עצמאי שמשלב רפלקציה, ארגון למידה וכלים לכל שלבי הסיעוד — בקצב שלכם."
        ctaLabel="לפרטים על החוברת"
        visual={
          <BookFrame
            src="/pics/noabook.jpeg"
            alt="כריכת המלווה הקליני – חוברת תהליכים לסטודנטים לסיעוד"
            priority
          />
        }
      />

      <section className={styles.bentoSection}>
        <Container>
          <h2 className={styles.sectionTitle}>מה תמצאו בפנים</h2>
          <div className={styles.bento}>
            {features.map((f, i) => (
              <article key={f.title} className={[styles.tile, styles[`t${(i % 3) + 1}`]].join(' ')}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.splitSection}>
        <Container>
          <div className={styles.split}>
            <BookFrame
              src="/pics/noaclinic.jpeg"
              alt="המלווה הקליני — תצוגת החוברת"
            />
            <div>
              <h2>למי זה מתאים?</h2>
              <p>
                לסטודנטים בכל שלבי התואר שרוצים דרך מסודרת לעצור, לעשות סדר,
                ולגדול גם בזהות המקצועית — לא רק בידע.
              </p>
              <p className={styles.note}>
                החוברת עובדת מצוין לבד, ואפשר גם לשלב עם ליווי או שיעורים פרטיים.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.cta}>
        <Container>
          <Button href="/#contact" variant="primary">
            צרו קשר
          </Button>
        </Container>
      </section>
    </div>
  )
}
