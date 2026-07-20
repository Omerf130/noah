import type { ReactNode } from 'react'
import styles from './SectionTitle.module.scss'

type SectionTitleProps = {
  title: string
  subtitle?: string
  as?: 'h2' | 'h3'
  align?: 'center' | 'start'
  className?: string
  children?: ReactNode
}

export default function SectionTitle({
  title,
  subtitle,
  as: Tag = 'h2',
  align = 'center',
  className = '',
}: SectionTitleProps) {
  const alignClass = align === 'center' ? styles.center : styles.start

  return (
    <div className={[styles.wrapper, alignClass, className].filter(Boolean).join(' ')}>
      <Tag className={styles.title}>{title}</Tag>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}
