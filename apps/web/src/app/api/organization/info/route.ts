import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { getOrgInfoTypeFromDB } from '@/crud/organization'
import { checkSubscription } from '@/lib/subscription'

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
    }
    const orgInfo = await getOrgInfoTypeFromDB(email)

    if (!orgInfo?.orgId) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const isValid = await checkSubscription(orgInfo?.orgId)

    return Response.json({
      ok: true,
      data: {
        isPro: isValid,
        avatar: session.user?.image,
        currency_type: orgInfo.currencyType,
        orgName: orgInfo.orgName
      },
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
