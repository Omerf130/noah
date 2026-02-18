import Link from 'next/link'
import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLinks}>
          <Link href="/#about">קצת עליי</Link>
          <Link href="/#process">ליווי אישי</Link>
          <Link href="/#clinical">המלווה הקליני</Link>
          <Link href="/#lessons">שיעורים פרטיים</Link>
          <Link href="/#contact">צור קשר</Link>
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

export default Footer

