import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs'

async function handler(req: NextRequest) {
  const body = await req.json()
  try {
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
      overdueInvoices.map(async (invoice) => {
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
    return NextResponse.json({
      ok: true,
      data: 'Your cron job for updating overdue payment is successful done',
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      ok: false,
      data: null,
      status: 500
    })
  }
}

export const POST = verifySignatureAppRouter(handler)
