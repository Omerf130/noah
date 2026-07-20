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
              <div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
