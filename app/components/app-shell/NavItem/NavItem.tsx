'use client'

import Link from 'next/link'
import Icon from '../../marketing/Icon/Icon'
import type { AppNavItem } from '../../../../lib/app-shell/navigation'
import styles from './NavItem.module.scss'

type NavItemProps = {
  item: AppNavItem
  isActive: boolean
  onNavigate?: () => void
  variant?: 'dashboard' | 'admin'
}

export default function NavItem({
  item,
  isActive,
  onNavigate,
  variant = 'dashboard',
}: NavItemProps) {
  const className = [
    styles.item,
    styles[variant],
    isActive ? styles.active : '',
    item.disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {item.icon ? (
        <Icon name={item.icon} size={18} className={styles.icon} aria-hidden="true" />
      ) : null}
      <span>{item.label}</span>
      {item.disabled ? <span className={styles.soon}>בקרוב</span> : null}
    </>
  )

  if (item.disabled || !item.href) {
    return (
      <span className={className} aria-disabled="true">
        {content}
      </span>
    )
  }

  return (
    <Link
      href={item.href}
      className={className}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  )
}
