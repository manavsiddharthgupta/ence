import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '../../../../lib/db'
import { instantInvoiceCreateServiceByGemini } from './service'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
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
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const blobUrl = searchParams.get('blobUrl')
    if (!blobUrl) {
      return Response.json({ ok: false, data: 'Invalid Url', status: 500 })
    }

    const parsedData = await instantInvoiceCreateServiceByGemini(blobUrl)
    if (!parsedData) {
      return Response.json({
        ok: false,
        data: 'Invalid Invoice Format',
        status: 500
      })
    }

    return Response.json({
      ok: true,
      data: parsedData,
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
