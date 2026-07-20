'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Nav.module.scss'

const navLinks = [
  { href: '/about', label: 'קצת עליי' },
  { href: '/courses', label: 'קורסים' },
  { href: '/products', label: 'מוצרים' },
  { href: '/personal-guidance', label: 'ליווי אישי' },
  { href: '/private-lessons', label: 'שיעורים פרטיים' },
  { href: '/contact', label: 'צור קשר' },
  { href: '/login', label: 'התחברות' },
]

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={styles.navWrapper}>
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
            <Link key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
