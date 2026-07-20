import Container from '../../../ui/Container/Container'
import Icon from '../../Icon/Icon'
import styles from './PainPoints.module.scss'

const pains = [
  { icon: 'checklist' as const, title: 'עומס שמצטבר', text: 'החומר לא מפסיק, והראש לא נותן לכם רגע של שקט.' },
  { icon: 'calendar' as const, title: 'שגרה שנשברת', text: 'מתכננים ללמוד — ואז שוב דוחים ליום אחר.' },
  { icon: 'chart' as const, title: 'לחץ לפני מבחנים', text: 'יודעים שצריך להתכונן, אבל לא יודעים מאיפה להתחיל.' },
  { icon: 'heart' as const, title: 'קליניקה שמציפה', text: 'חוויות מהשטח שמעוררות הרבה — ולא תמיד יודעים איך לעבד.' },
  { icon: 'book' as const, title: 'חומר שלא נשאר', text: 'מבינים בשיעור, ושבוע אחר כך הכול מתפזר.' },
  { icon: 'sparkle' as const, title: 'רצון להרגיש מסוגלים', text: 'לא רק לעבור — אלא להרגיש שאתם בדרך הנכונה.' },
]

export default function PainPoints() {
  return (
    <section className={styles.wrapper}>
      <Container>
        <div className={styles.header}>
          <span className={styles.eyebrow}>מכירים את זה?</span>
          <h2 className={styles.title}>התואר לסיעוד לא חייב להרגיש כמו מאבק יומיומי</h2>
        </div>
        <div className={styles.bento}>
          {pains.map((pain, i) => (
            <article key={pain.title} className={[styles.tile, styles[`size${(i % 3) + 1}`]].join(' ')}>
              <Icon name={pain.icon} size={28} className={styles.icon} />
              <h3>{pain.title}</h3>
              <p>{pain.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
