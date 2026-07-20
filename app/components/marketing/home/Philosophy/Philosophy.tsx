import Container from '../../../ui/Container/Container'
import Button from '../../../ui/Button/Button'
import styles from './Philosophy.module.scss'

export default function Philosophy() {
  return (
    <section className={styles.wrapper}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>ללמוד אחרת</span>
            <h2 className={styles.title}>לא עוד שעות — דרך שמתאימה לכם</h2>
            <p className={styles.text}>
              הרבה סטודנטים חכמים נתקעים לא כי חסר להם ידע, אלא כי אין מסגרת שמחזיקה אותם:
              שגרה, תרגול, סדר בראש, וביטחון כשקשה.
            </p>
            <p className={styles.text}>
              ב&quot;נוח&quot; עובדים ביחד על הדרך — ליווי אישי, שיעורים ממוקדים, וחוברת שמלווה
              אתכם לאורך התואר, בקצב שלכם.
            </p>
            <Button href="/about" variant="ghost">
              קצת עליי
            </Button>
          </div>
          <blockquote className={styles.quote}>
            <p>״המטרה היא לא ללמוד יותר — אלא ללמוד נכון, בהתמדה, ובלי להישבר בדרך.״</p>
            <footer>הגישה של נוח</footer>
          </blockquote>
        </div>
      </Container>
    </section>
  )
}
