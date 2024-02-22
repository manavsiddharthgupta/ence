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

    const { dueDate, paymentMethod, paymentTerms, notes, approvalStatus } =
      await request.json()

    if (!dueDate || !paymentMethod || !paymentTerms || !notes) {
      console.error(
        'Invalid data ->',
        dueDate,
        paymentMethod,
        notes,
        paymentMethod
      )
      return Response.json({
        ok: true,
        data: 'Invalid data, please check data',
        status: 409
      })
    }

    const response = await db.invoice.update({
      where: {
        id: invoiceId
      },
      data: {
        dueDate,
        paymentMethod,
        paymentTerms,
        notes,
        approvalStatus: approvalStatus !== null ? approvalStatus : 'APPROVED'
      },
      select: {
        dueDate: true,
        paymentMethod: true,
        paymentTerms: true,
        notes: true,
        approvalStatus: true
      }
    })

    if (approvalStatus) {
      const auditResponse = await db.auditTrail.create({
        data: {
          invoiceId: invoiceId,
          actionType: 'APPROVAL_ACTION',
          title: 'Customer Approval of Invoice',
          description: 'Customer has officially approved the invoice.',
          oldStatus: 'UNAPPROVED',
          newStatus: approvalStatus === 'APPROVED' ? 'APPROVED' : 'REJECTED'
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
