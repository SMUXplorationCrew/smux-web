import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
export const session = async () => {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  return { payload, user: user?.active === false ? null : user }
}
