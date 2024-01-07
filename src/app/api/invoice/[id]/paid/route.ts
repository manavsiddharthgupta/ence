import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { db } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({
        ok: false,
        data: 'You are not authorized',
        status: 401
      })
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
      return Response.json({
        ok: false,
        data: 'Organization not found',
        status: 404
      })
    }

    const invoiceId = params.id
    const invoice = await db.invoice.findUnique({
      where: {
        id: invoiceId
      }
    })

    const oldStatus = invoice?.paymentStatus
    if (oldStatus === 'PAID') {
      return Response.json({
        ok: false,
        data: 'Cannot modify invoice that is already paid.',
        status: 409
      })
    }

    const response = await db.invoice.update({
      where: {
        id: invoiceId
      },
      data: {
        paymentStatus: 'PAID',
        dueAmount: 0
      }
    })

    await db.auditTrail.create({
      data: {
        actionType: 'PAYMENT_STATUS_CHANGE',
        invoiceId: invoiceId,
        oldStatus: oldStatus,
        newStatus: 'PAID'
      }
    })

    return Response.json({ ok: true, data: response, status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({
      ok: false,
      data: 'Error while updating status',
      status: 500
    })
  }
}
