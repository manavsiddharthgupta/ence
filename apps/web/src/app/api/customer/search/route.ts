import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { getOrgId } from '@/crud/organization'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
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
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const response = await db.customerInfo.findMany({
      where: {
        organisationId: orgId,
        OR: [
          { legalName: { contains: query || '', mode: 'insensitive' } },
          { email: { contains: query || '', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        email: true,
        legalName: true,
        whatsAppNumber: true
      }
    })

    return Response.json({ ok: true, data: response, staus: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
