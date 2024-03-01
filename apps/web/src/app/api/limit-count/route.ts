import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { getOrgId } from '@/crud/organization'
import { db } from '@/lib/db'
import { UserAPILimit } from 'database'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
    }
    const orgId = await getOrgId(email)

    if (!orgId) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const res = await db.userAPILimit.findMany({
      where: {
        organizationId: orgId
      }
    })

    type ResObject = Record<UserAPILimit['type'], Omit<number, 'type'>>

    const apiLimit: ResObject = res.reduce((acc, item) => {
      const { type, ...rest } = item
      acc[type] = rest.count
      return acc
    }, {} as ResObject)

    return Response.json({ ok: true, data: apiLimit, status: 200 })
  } catch (err) {
    console.error('Error:', err)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
