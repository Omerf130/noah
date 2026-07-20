'use client'

import { useState } from 'react'
import styles from './Nav.module.scss'
import Image from 'next/image'
import Link from 'next/link'

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

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
          onClick={toggleMenu}
          aria-label="תפריט"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        {isMenuOpen && (
          <div 
            className={styles.overlay}
            onClick={closeMenu}
          />
        )}

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <Link href="/#about" onClick={closeMenu}>קצת עליי</Link>
          <Link href="/#process" onClick={closeMenu}>ליווי אישי</Link>
          <Link href="/#clinical" onClick={closeMenu}>המלווה הקליני</Link>
          <Link href="/#lessons" onClick={closeMenu}>שיעורים פרטיים</Link>
          <Link href="/#contact" onClick={closeMenu}>צור קשר</Link>
        </div>
      </nav>
    </header>
  );
};

export default Nav;


