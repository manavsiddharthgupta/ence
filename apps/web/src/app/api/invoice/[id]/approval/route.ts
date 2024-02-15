import { db } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id
    const body = await request.json()
    const { status } = body

    const invoice = await db.invoice.findUnique({
      where: {
        id: invoiceId
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
    if (status === oldStatus) {
      return Response.json({
        ok: false,
        data: 'Cannot modify invoice that is already ' + status + '.',
        status: 409
      })
    }

    const response = await db.invoice.update({
      where: {
        id: invoiceId
      },
      data: {
        approvalStatus: status === 'APPROVED' ? 'APPROVED' : 'REJECTED'
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
      data:
        'Congratulation you have approved the invoice. Your Invoice no. is INV-' +
        response.invoiceNumber +
        '. Pay the invoice before due date.',
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({
      ok: false,
      data: 'Error while updating status',
      status: 500
    })
  }
}
