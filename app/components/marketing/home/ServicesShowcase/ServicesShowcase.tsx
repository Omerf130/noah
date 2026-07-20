import Link from 'next/link'
import Container from '../../../ui/Container/Container'
import Icon from '../../Icon/Icon'
import { homepageServices } from '../../../../../lib/content/homepage'
import styles from './ServicesShowcase.module.scss'

export default function ServicesShowcase() {
  return (
    <section className={styles.wrapper} id="services">
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>{homepageServices.title}</h2>
        </div>

        <div className={styles.panels}>
          {homepageServices.items.map((service) => (
            <article
              key={service.id}
              id={service.id}
              className={[styles.panel, styles[service.accent]].join(' ')}
            >
              <div className={styles.panelTop}>
                <Icon name={service.icon} size={32} />
                <div>
                  <h3>{service.title}</h3>
                </div>
              </div>
              <p>{service.text}</p>
              <div className={styles.miniPreview} aria-hidden="true">
                <div className={styles.miniBar}>
                  <span style={{ width: '72%' }} />
                </div>
                <span>{service.title}</span>
              </div>
              <Link href={service.href} className={styles.link}>
                לפרטים המלאים ←
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
