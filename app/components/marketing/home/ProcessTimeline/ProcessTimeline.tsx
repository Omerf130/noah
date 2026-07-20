import Container from '../../../ui/Container/Container'
import styles from './ProcessTimeline.module.scss'

const steps = [
  {
    num: '01',
    title: 'מבינים מה אתם צריכים',
    text: 'קוראים, מתייעצים, ומזהים מה באמת יעזור לכם עכשיו.',
  },
  {
    num: '02',
    title: 'פונים לשיחה קצרה',
    text: 'וואטסאפ או טופס — נדבר על האתגרים ועל מה שאתם מחפשים.',
  },
  {
    num: '03',
    title: 'בונים תוכנית מותאמת',
    text: 'ליווי, שיעור, חוברת — או שילוב. בקצב שמתאים לכם.',
  },
  {
    num: '04',
    title: 'יוצאים לדרך מסודרת',
    text: 'עם כלים, תרגול, ומישהי שמלווה אתכם לאורך הדרך.',
  },
]

export default function ProcessTimeline() {
  return (
    <section className={styles.wrapper} id="how-it-works">
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>איך מתחילים?</h2>
          <p className={styles.subtitle}>ארבעה צעדים פשוטים — בלי בירוקרטיה, בלי לחץ.</p>
        </div>
        <ol className={styles.timeline}>
          {steps.map((step) => (
            <li key={step.num} className={styles.step}>
              <span className={styles.num}>{step.num}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
