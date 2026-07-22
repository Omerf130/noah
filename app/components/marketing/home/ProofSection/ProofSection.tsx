import Container from '../../../ui/Container/Container'
import { homepageWhyNoah } from '../../../../../lib/content/homepage'
import styles from './ProofSection.module.scss'

export default function ProofSection() {
  return (
    <section className={styles.wrapper}>
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>{homepageWhyNoah.title}</h2>
        </div>
        <div className={styles.grid}>
          {homepageWhyNoah.items.map((item) => (
            <div key={item.title} className={styles.card}>
              <span className={styles.check}>✓</span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
