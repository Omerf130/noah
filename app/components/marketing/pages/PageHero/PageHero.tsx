import type { ReactNode } from 'react'
import Button from '../../../ui/Button/Button'
import styles from './PageHero.module.scss'

type PageHeroProps = {
  variant: 'split' | 'product' | 'journey' | 'focus'
  eyebrow: string
  title: string
  subtitle: string
  ctaHref?: string
  ctaLabel?: string
  visual?: ReactNode
  stat?: string
}

export default function PageHero({
  variant,
  eyebrow,
  title,
  subtitle,
  ctaHref = '/contact',
  ctaLabel = 'צרו קשר',
  visual,
  stat,
}: PageHeroProps) {
  return (
    <section className={[styles.hero, styles[variant]].join(' ')}>
      <div className={styles.inner}>
        {stat && <span className={styles.stat}>{stat}</span>}
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <Button href={ctaHref} variant={variant === 'journey' ? 'secondary' : 'primary'}>
          {ctaLabel}
        </Button>
        {visual && <div className={styles.visual}>{visual}</div>}
      </div>
    </section>
  )
}
