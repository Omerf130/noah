import 'server-only'

import { headers } from 'next/headers'
import { parseClientIpFromForwardedFor } from './parse-client-ip'

export async function getClientIp(): Promise<string> {
  const headerStore = await headers()
  const forwardedFor = headerStore.get('x-forwarded-for')
  return parseClientIpFromForwardedFor(forwardedFor)
}
