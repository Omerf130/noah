import Link from 'next/link'
import BookFrame from '../../BookFrame/BookFrame'
import { getContactHref } from '../../../../../lib/contact'
import type { ContactServiceSlug } from '../../../../../lib/content/contact'
import styles from './CatalogCard.module.scss'

type CatalogCardProps = {
  title: string
  subtitle?: string
  description: string
  href: string
  contactService?: ContactServiceSlug
  status?: 'coming-soon' | 'available'
  accent?: 'purple' | 'gold' | 'lavender'
  image?: { src: string; alt: string }
  ctaLabel?: string
  showContactLink?: boolean
}

export default function CatalogCard({
  title,
  subtitle,
  description,
  href,
  contactService,
  status,
  accent = 'purple',
  image,
  ctaLabel = 'לפרטים',
  showContactLink = true,
}: CatalogCardProps) {
  const accentClass = accent !== 'purple' ? styles[accent] : ''

  return (
    <article className={[styles.card, accentClass].filter(Boolean).join(' ')}>
      <div className={styles.titleRow}>
        <h3>{title}</h3>
        {status === 'coming-soon' ? <span className={styles.badge}>בקרוב</span> : null}
      </div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <p>{description}</p>
      {image && (
        <div className={styles.imageWrap}>
          <BookFrame src={image.src} alt={image.alt} />
        </div>
      )}
      <Link href={href} className={styles.link}>
        {ctaLabel} ←
      </Link>
      {showContactLink && contactService ? (
        <Link href={getContactHref(contactService)} className={styles.link}>
          ליצירת קשר ←
        </Link>
      ) : null}
    </article>
  )
}
