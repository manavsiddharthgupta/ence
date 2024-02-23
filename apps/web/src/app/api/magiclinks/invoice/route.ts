import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    const secret = process.env.INVOICE_APPROVAL_SECRET_KEY ?? ''

    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    if (!token) {
      return Response.json({
        ok: false,
        data: 'Invalid token, not authorized.',
        status: 500
      })
    }

    const decode = jwt.verify(token, secret)
    if (typeof decode === 'string') {
      return Response.json({
        ok: false,
        data: 'Invalid token, token type string.',
        status: 500
      })
    }
    const orgId = decode?.orgId ?? null
    const invoiceId = decode?.invoiceId ?? null
    const status = decode?.status ?? null
    if (!orgId || !status || !invoiceId) {
      return Response.json({
        ok: false,
        data: 'You are not authorized.',
        status: 500
      })
    }

    const invoice = await db.invoice.findUnique({
      where: {
        id: invoiceId
      },
      select: {
        id: true,
        dueDate: true,
        totalAmount: true,
        approvalStatus: true,
        invoiceNumber: true,
        items: true,
        organization: {
          select: {
            orgName: true
          }
        }
      }
    })
    if (!invoice?.id) {
      return Response.json({
        ok: false,
        data: 'Invalid invoice, please check your invoice id.',
        status: 500
      })
    }

    const oldStatus = invoice?.approvalStatus
    if (oldStatus !== 'UNAPPROVED') {
      return Response.json({
        ok: true,
        data: { ...invoice, fresh: false },
        status: 409
      })
    }

    const response = await db.invoice.update({
      where: {
        id: invoiceId
      },
      data: {
        approvalStatus: status === 'APPROVED' ? 'APPROVED' : 'REJECTED'
      },
      select: {
        invoiceNumber: true,
        approvalStatus: true
      }
    })

    await db.auditTrail.create({
      data: {
        actionType: 'APPROVAL_ACTION',
        title: 'Customer Approval of Invoice',
        description: 'Customer has officially approved the invoice.',
        invoiceId: invoiceId,
        oldStatus: oldStatus,
        newStatus: status === 'APPROVED' ? 'APPROVED' : 'REJECTED'
      }
    })

    return Response.json({
      ok: true,
      data: {
        ...invoice,
        ...response,
        fresh: true
      },
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({
      ok: false,
      data: 'Error while updating status.',
      status: 500
    })
  }
}
