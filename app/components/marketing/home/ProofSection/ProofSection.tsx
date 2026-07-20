import Container from '../../../ui/Container/Container'
import styles from './ProofSection.module.scss'

const changes = [
  'עזרה בארגון הלמידה',
  'חיזוק ביטחון בהתמודדות עם חומר',
  'הפחתת תחושת לחץ',
  'תחושה שיש דרך משמעותית',
]

export default function ProofSection() {
  return (
    <section className={styles.wrapper}>
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>מה משתנה במהלך הדרך</h2>
          <p className={styles.subtitle}>כל אחד עובר את זה בקצב שלו — אבל הרבה חוויות חוזרות על עצמן.</p>
        </div>
        <div className={styles.grid}>
          {changes.map((change) => (
            <div key={change} className={styles.card}>
              <span className={styles.check}>✓</span>
              <p>{change}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
