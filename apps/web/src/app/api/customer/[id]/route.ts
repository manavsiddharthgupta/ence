import { getOrgId } from '@/crud/organization'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const customerId = params.id

    const response = await db.customerInfo.delete({
      where: {
        id: customerId,
        organisationId: orgId
      }
    })

    return Response.json({
      ok: true,
      data: response.legalName,
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
