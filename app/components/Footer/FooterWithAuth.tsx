import { getPublicAuthNavigation } from '../../../lib/navigation/get-public-auth-navigation'
import { buildPublicNavLinks } from '../../../lib/navigation/auth-nav'
import Footer from './Footer'

export default async function FooterWithAuth() {
  const authNavigation = await getPublicAuthNavigation()
  const navLinks = buildPublicNavLinks(authNavigation)

  return <Footer navLinks={navLinks} />
}
