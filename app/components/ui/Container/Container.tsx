import type { ReactNode } from 'react'
import styles from './Container.module.scss'

type ContainerProps = {
  children: ReactNode
  narrow?: boolean
  className?: string
}

export default function Container({ children, narrow = false, className = '' }: ContainerProps) {
  const classNames = [styles.container, narrow && styles.narrow, className]
    .filter(Boolean)
    .join(' ')

  return <div className={classNames}>{children}</div>
}
