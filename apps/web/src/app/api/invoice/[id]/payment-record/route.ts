import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { getOrgId } from '@/crud/organization'

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
    const orgId = await getOrgId(email)

    if (!orgId) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({
        ok: false,
        data: 'Organization not found',
        status: 404
      })
    }

    const body = await request.json()

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

    if (invoice?.approvalStatus !== 'APPROVED') {
      return Response.json({
        ok: false,
        data: 'Invoice is not yet approved.',
        status: 409
      })
    }

    if (!invoice?.dueAmount) {
      return Response.json({
        ok: false,
        data: 'Invalid due amount.',
        status: 409
      })
    }

    if (invoice?.dueAmount < body?.amount || body?.amount <= 0) {
      return Response.json({
        ok: false,
        data: 'Invalid amount, please enter valid amount.',
        status: 409
      })
    }

    if (invoice?.dueAmount - body.amount !== 0) {
      // Todo: payment status will be partial paid
      return Response.json({
        ok: false,
        data: 'Partial paid feature is not available.',
        status: 409
      })
    }

    const response = await db.invoice.update({
      where: {
        id: invoiceId
      },
      data: {
        paymentStatus: 'PAID', // will change based on the body.amount
        dueAmount: invoice?.dueAmount - body?.amount,
        paymentMethod: body?.paymentType === 'cash' ? 'CASH' : 'DIGITAL_WALLET'
      }
    })

    await db.auditTrail.create({
      data: {
        actionType: 'PAYMENT_STATUS_CHANGE',
        invoiceId: invoiceId,
        oldStatus: oldStatus,
        newStatus: 'PAID', // Todo: will change based on the body.amount
        title: 'Payment Status Change',
        description:
          'You updated the payment status of the invoice to Paid, signifies  the successful completion of the payment.' // Todo: will change based on the body.amount
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
