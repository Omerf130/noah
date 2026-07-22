import Container from '../../../ui/Container/Container'
import Icon from '../../Icon/Icon'
import { homepageAudience } from '../../../../../lib/content/homepage'
import styles from './PainPoints.module.scss'

const icons = ['checklist', 'calendar', 'chart', 'heart', 'sparkle'] as const

type PainPointsProps = {
  title?: string
  items?: string[]
}

export default function PainPoints({
  title = homepageAudience.title,
  items = homepageAudience.items,
}: PainPointsProps) {
  return (
    <section className={styles.wrapper}>
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <ul className={styles.list}>
          {items.map((text, i) => (
            <li key={text} className={styles.item}>
              <Icon name={icons[i % icons.length]} size={24} className={styles.icon} />
              <p className={styles.itemText}>{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
