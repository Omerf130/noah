'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { marketingNavLinks, type PublicAuthNavItem } from '../../../lib/navigation/auth-nav'
import styles from './Nav.module.scss'

const SCROLL_THRESHOLD = 12

type NavProps = {
  authItems: PublicAuthNavItem[]
}

export default function Nav({ authItems }: NavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navLinks = [...marketingNavLinks, ...authItems]

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })

    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header
      className={[styles.navWrapper, isScrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}
    >
      <nav className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/" onClick={closeMenu}>
            <Image
              src="/pics/logo.jpeg"
              alt="נוח – לוגו ליווי סטודנטים לסיעוד"
              width={90}
              height={90}
            />
          </Link>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="תפריט"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          {navLinks.map((link) => (
            <Link key={`${link.href}-${link.label}`} href={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
