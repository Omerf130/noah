import Link from 'next/link'
import Container from '../../../ui/Container/Container'
import BookFrame from '../../BookFrame/BookFrame'
import Icon from '../../Icon/Icon'
import styles from './ServicesShowcase.module.scss'

const services = [
  {
    id: 'process',
    href: '/private-process',
    anchor: '#process',
    title: 'ליווי אישי',
    subtitle: '6 מפגשים מובנים',
    text: 'שגרה, התמדה וביטחון — לא רק בחומר, אלא בדרך שלכם.',
    accent: 'purple',
    icon: 'calendar' as const,
  },
  {
    id: 'clinical',
    href: '/clinical',
    anchor: '#clinical',
    title: 'המלווה הקליני',
    subtitle: 'חוברת תהליכים',
    text: 'רפלקציה, ארגון למידה וכלים לכל שלבי התואר — בקצב שלכם.',
    accent: 'gold',
    icon: 'book' as const,
    image: '/pics/noabook.jpeg',
  },
  {
    id: 'lessons',
    href: '/private-lessons',
    anchor: '#lessons',
    title: 'שיעורים פרטיים',
    subtitle: 'ממוקדים בזום',
    text: 'הסברים צעד-אחר-צעד, תרגול חכם והכנה למבחנים.',
    accent: 'lavender',
    icon: 'sparkle' as const,
  },
]

export default function ServicesShowcase() {
  return (
    <section className={styles.wrapper} id="services">
      <Container>
        <div className={styles.header}>
          <span className={styles.eyebrow}>מה מחכה לכם</span>
          <h2 className={styles.title}>שלוש דרכים ללמוד בנוח</h2>
          <p className={styles.subtitle}>אפשר לבחור שירות אחד, או לשלב — לפי מה שמתאים לכם עכשיו.</p>
        </div>

        <div className={styles.panels}>
          {services.map((service) => (
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
                  <div className={styles.miniBar}><span style={{ width: '72%' }} /></div>
                  <span>מסלול למידה אישי</span>
                </div>
              )}
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
