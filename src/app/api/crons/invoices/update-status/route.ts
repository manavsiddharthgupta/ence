import {db} from '@/lib/db'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url)
    const key = searchParams.get('key')
    if (key !== process.env.NEXT_CRON_SECRET) {
      return Response.json({
        ok: false,
        data: 'You are not authorized',
        status: 401
      })
    }

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const overdueInvoices = await db.invoice.findMany({
      where: {
        dueDate: {
          lt: currentDate
        },
        paymentStatus: 'DUE'
      }
    })

    await Promise.all(
      overdueInvoices.map(async (invoice: any) => {
        await db.invoice.update({
          where: {
            id: invoice.id
          },
          data: {
            paymentStatus: 'OVERDUE',
            auditTrailEntries: {
              create: {
                actionType: 'PAYMENT_STATUS_CHANGE',
                title: 'Payment Status Change',
                description:
                  'The payment deadline has passed, and the invoice is now overdue for payment.',
                oldStatus: 'DUE',
                newStatus: 'OVERDUE'
              }
            }
          }
        })
      })
    )
    return Response.json({
      ok: true,
      data: 'Your cron job for updating overdue payment is successful done',
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ok: false, data: null, status: 500})
  }
}
