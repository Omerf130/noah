import type { ReactNode } from 'react'
import styles from './SectionBand.module.scss'

type BandVariant = 'purple' | 'gold' | 'warm'

type SectionBandProps = {
  children: ReactNode
  variant?: BandVariant
  className?: string
  id?: string
}

export default function SectionBand({
  children,
  variant = 'warm',
  className = '',
  id,
}: SectionBandProps) {
  return (
    <section
      id={id}
      className={[styles.band, styles[variant], className].filter(Boolean).join(' ')}
    >
      {children}
    </section>
  )
}
