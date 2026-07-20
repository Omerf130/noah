import Link from 'next/link'
import styles from './Footer.module.scss'

const footerLinks = [
  { href: '/about', label: 'קצת עליי' },
  { href: '/courses', label: 'קורסים' },
  { href: '/products', label: 'מוצרים' },
  { href: '/personal-guidance', label: 'ליווי אישי' },
  { href: '/private-lessons', label: 'שיעורים פרטיים' },
  { href: '/contact', label: 'צור קשר' },
  { href: '/login', label: 'התחברות' },
]

export default function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLinks}>
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className={styles.footerCredit}>
          <p>
            אתר זה נבנה על ידי-{' '}
            <a href="https://weblio.co.il" target="_blank" rel="noopener noreferrer">
              weblio
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
