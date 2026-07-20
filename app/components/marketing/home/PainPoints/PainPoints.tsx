import Container from '../../../ui/Container/Container'
import Icon from '../../Icon/Icon'
import { homepageAudience } from '../../../../../lib/content/homepage'
import styles from './PainPoints.module.scss'

const icons = ['checklist', 'calendar', 'chart', 'heart', 'sparkle'] as const

export default function PainPoints() {
  return (
    <section className={styles.wrapper}>
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>{homepageAudience.title}</h2>
        </div>
        <div className={styles.bento}>
          {homepageAudience.items.map((text, i) => (
            <article key={text} className={[styles.tile, styles[`size${(i % 3) + 1}`]].join(' ')}>
              <Icon name={icons[i % icons.length]} size={28} className={styles.icon} />
              <p className={styles.audienceText}>{text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
