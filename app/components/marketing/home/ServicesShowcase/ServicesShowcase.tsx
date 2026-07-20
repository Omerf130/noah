import Link from 'next/link'
import Container from '../../../ui/Container/Container'
import BookFrame from '../../BookFrame/BookFrame'
import Icon from '../../Icon/Icon'
import { coursesCatalog } from '../../../../../lib/content/courses'
import { productsCatalog } from '../../../../../lib/content/products'
import { servicesCatalog } from '../../../../../lib/content/services'
import styles from './ServicesShowcase.module.scss'

const showcaseItems = [
  {
    id: 'guidance',
    href: servicesCatalog[0].path,
    title: servicesCatalog[0].title,
    subtitle: servicesCatalog[0].subtitle,
    text: servicesCatalog[0].shortDescription,
    accent: 'purple',
    icon: 'calendar' as const,
  },
  {
    id: 'booklet',
    href: productsCatalog[0].path,
    title: productsCatalog[0].title,
    subtitle: productsCatalog[0].subtitle,
    text: productsCatalog[0].shortDescription,
    accent: 'gold',
    icon: 'book' as const,
    image: productsCatalog[0].image?.src,
  },
  {
    id: 'lessons',
    href: servicesCatalog[1].path,
    title: servicesCatalog[1].title,
    subtitle: servicesCatalog[1].subtitle,
    text: servicesCatalog[1].shortDescription,
    accent: 'lavender',
    icon: 'sparkle' as const,
  },
]

export default function ServicesShowcase() {
  const course = coursesCatalog[0]

  return (
    <section className={styles.wrapper} id="services">
      <Container>
        <div className={styles.header}>
          <span className={styles.eyebrow}>מה מחכה לכם</span>
          <h2 className={styles.title}>דרכים ללמוד בנוח</h2>
          <p className={styles.subtitle}>שירותים, מוצרים וקורסים — לבחור מה שמתאים לכם עכשיו.</p>
        </div>

        <div className={styles.panels}>
          {showcaseItems.map((service) => (
            <article
              key={service.id}
              id={service.id}
              className={[styles.panel, styles[service.accent]].join(' ')}
            >
              <div className={styles.panelTop}>
                <Icon name={service.icon} size={32} />
                <div>
                  <h3>{service.title}</h3>
                  <span>{service.subtitle}</span>
                </div>
              </div>
              <p>{service.text}</p>
              {service.image ? (
                <BookFrame
                  src={service.image}
                  alt="כריכת המלווה הקליני – חוברת תהליכים לסטודנטים לסיעוד"
                  className={styles.book}
                />
              ) : (
                <div className={styles.miniPreview} aria-hidden="true">
                  <div className={styles.miniBar}>
                    <span style={{ width: '72%' }} />
                  </div>
                  <span>מסלול למידה אישי</span>
                </div>
              )}
              <Link href={service.href} className={styles.link}>
                לפרטים המלאים ←
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.catalogLinks}>
          <Link href="/courses">כל הקורסים ←</Link>
          <Link href={course.path}>קורס {course.title} (בקרוב) ←</Link>
          <Link href="/products">כל המוצרים ←</Link>
        </div>
      </Container>
    </section>
  )
}
