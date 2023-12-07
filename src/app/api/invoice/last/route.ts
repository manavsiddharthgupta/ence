import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '../../auth/[...nextauth]/route'
import { error } from 'console'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
    }
    const org = await db.user.findUnique({
      where: {
        email: email
      },
      select: {
        email: true,
        organizations: {
          select: {
            id: true,
            orgName: true
          }
        }
      }
    })

    if (!org?.organizations?.id) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({ ok: false, data: error, status: 404 })
    }

    const response = await db.invoice.findFirst({
      where: {
        organizationId: org.organizations.id
      },
      select: {
        invoiceNumber: true
      },
      orderBy: {
        invoiceNumber: 'desc'
      }
    })

    return Response.json({ ok: true, data: response, status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
