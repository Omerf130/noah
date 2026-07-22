import { getPublicAuthNavigation } from '../../../lib/navigation/get-public-auth-navigation'
import { getAuthNavItems } from '../../../lib/navigation/auth-nav'
import Nav from './Nav'

export default async function NavWithAuth() {
  const authNavigation = await getPublicAuthNavigation()

  return <Nav authItems={getAuthNavItems(authNavigation)} />
}
