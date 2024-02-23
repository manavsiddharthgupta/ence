import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { getOrgId } from '@/crud/organization'

export async function GET(
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

    const invoiceId = params.id

    const response = await db.invoice.findUnique({
      where: {
        id: invoiceId
      },
      select: {
        id: true,
        customerInfo: true,
        dateIssue: true,
        dueDate: true,
        invoiceNumber: true,
        notes: true,
        paymentMethod: true,
        paymentStatus: true,
        paymentTerms: true,
        sendingMethod: true,
        shippingCharge: true,
        packagingCharge: true,
        dueAmount: true,
        adjustmentFee: true,
        invoiceTotal: true,
        subTotal: true,
        totalAmount: true,
        items: true,
        approvalStatus: true,
        auditTrailEntries: {
          orderBy: { createdAt: 'asc' }
        },
        discount: true,
        receiptSendStatus: true,
        instantInvoiceLink: true,
        relatedDocuments: true
      }
    })
    return Response.json({ ok: true, data: response, status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}

export async function PATCH(
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

    const invoiceId = params.id

    const {
      dueDate,
      paymentMethod,
      sendingMethod,
      notes,
      approvalStatus,
      oldStatus
    } = await request.json()

    if (
      !dueDate ||
      !paymentMethod ||
      !sendingMethod ||
      !notes ||
      !approvalStatus
    ) {
      console.error(
        'Invalid data ->',
        dueDate,
        paymentMethod,
        notes,
        approvalStatus,
        sendingMethod
      )
      return Response.json({
        ok: false,
        data: 'Invalid data, please check the data you are sending.',
        status: 409
      })
    }

    const response = await db.invoice.update({
      where: {
        id: invoiceId
      },
      data: {
        dueDate,
        paymentTerms: 'CUSTOM',
        paymentMethod,
        sendingMethod,
        notes,
        approvalStatus: oldStatus === 'APPROVED' ? 'APPROVED' : approvalStatus
      },
      select: {
        dueDate: true,
        paymentMethod: true,
        sendingMethod: true,
        notes: true,
        approvalStatus: true
      }
    })

    if (oldStatus === 'UNAPPROVED') {
      const auditResponse = await db.auditTrail.create({
        data: {
          invoiceId: invoiceId,
          actionType: 'APPROVAL_ACTION',
          title: 'Invoice Approval Status Change',
          description:
            approvalStatus === 'APPROVED'
              ? 'You have approved the invoice.'
              : 'You have rejected the invoice.',
          oldStatus: 'UNAPPROVED',
          newStatus: approvalStatus
        }
      })
      return Response.json({
        ok: true,
        data: { ...response, ...auditResponse },
        status: 200
      })
    } else if (approvalStatus !== oldStatus && oldStatus === 'REJECTED') {
      const auditResponse = await db.auditTrail.create({
        data: {
          invoiceId: invoiceId,
          actionType: 'APPROVAL_ACTION',
          title: 'Invoice Approval Status Change',
          description: 'You have approved the invoice.',
          oldStatus: 'REJECTED',
          newStatus: 'APPROVED'
        }
      })
      return Response.json({
        ok: true,
        data: { ...response, ...auditResponse },
        status: 200
      })
    }

    return Response.json({ ok: true, data: response, status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
