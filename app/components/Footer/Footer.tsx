import Link from 'next/link'
import styles from './Footer.module.scss'

type FooterLink = {
  href: string
  label: string
}

type FooterProps = {
  navLinks: readonly FooterLink[]
}

export default function Footer({ navLinks }: FooterProps) {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLinks}>
          {navLinks.map((link) => (
            <Link key={`${link.href}-${link.label}`} href={link.href}>
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
