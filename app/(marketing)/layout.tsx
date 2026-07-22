import NavWithAuth from '../components/Nav/NavWithAuth'
import FooterWithAuth from '../components/Footer/FooterWithAuth'
import styles from './layout.module.scss'

export const dynamic = 'force-dynamic'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        דלג לתוכן הראשי
      </a>
      <NavWithAuth />
      <main id="main-content" className={styles.main}>
        {children}
      </main>
      <FooterWithAuth />
    </>
  )
}
