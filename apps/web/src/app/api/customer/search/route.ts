import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
    }
    const user = await db.user.findUnique({
      where: {
        email: email
      }
    })
    const id = user?.id
    if (!id) {
      console.error('Error:', 'User Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }
    const organization = await db.organization.findUnique({
      where: {
        createdById: id
      }
    })

    if (!organization) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const response = await db.customerInfo.findMany({
      where: {
        organisationId: organization.id,
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
