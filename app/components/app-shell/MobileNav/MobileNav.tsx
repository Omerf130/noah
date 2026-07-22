'use client'

import { useEffect, useState } from 'react'
import type { AppNavItem, AppShellVariant } from '../../../../lib/app-shell/navigation'
import AppSidebar from '../AppSidebar/AppSidebar'
import styles from './MobileNav.module.scss'

type MobileNavProps = {
  items: AppNavItem[]
  variant: AppShellVariant
}

export default function MobileNav({ items, variant }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <div className={styles.mobileNav}>
      <button
        type="button"
        className={styles.menuButton}
        aria-label="פתיחת תפריט ניווט"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        תפריט
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            className={styles.overlay}
            aria-label="סגירת תפריט"
            onClick={closeMenu}
          />
          <div className={[styles.drawer, styles[variant]].join(' ')}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>ניווט</span>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="סגירת תפריט ניווט"
                onClick={closeMenu}
              >
                סגירה
              </button>
            </div>
            <AppSidebar
              items={items}
              variant={variant}
              onNavigate={closeMenu}
              className={styles.drawerSidebar}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
