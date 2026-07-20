import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer/Footer'

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
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}
