import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { getOrgId } from '@/crud/organization'
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

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const sales = await db.invoice.groupBy({
      by: ['dateIssue', 'totalAmount'],
      orderBy: {
        dateIssue: 'desc'
      },
      where: {
        organizationId: orgId,
        dateIssue: {
          gte: sevenDaysAgo.toISOString()
        }
      }
    })

    return Response.json({
      ok: true,
      data: { sales },
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
