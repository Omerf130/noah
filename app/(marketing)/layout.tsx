import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer/Footer'
import styles from './layout.module.scss'

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
      <Nav />
      <main id="main-content" className={styles.main}>
        {children}
      </main>
      <Footer />
    </>
  )
}
