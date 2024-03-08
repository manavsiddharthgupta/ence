import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { getOrgId } from '@/crud/organization'
import { checkApiLimit, increaseApiLimit } from '@/lib/api-limits'
import { checkSubscription } from '@/lib/subscription'
import { InvoiceJobs } from 'events/jobs-publisher'

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
        invoiceNumber: true,
        dateIssue: true,
        dueDate: true,
        customerInfo: true,
        organization: {
          select: { orgName: true, id: true, email: true }
        },
        items: {
          select: {
            id: true,
            name: true,
            unit: true,
            price: true,
            quantity: true,
            total: true
          }
        },
        subTotal: true,
        discount: true,
        adjustmentFee: true,
        lateCharge: true,
        invoiceTotal: true,
        packagingCharge: true,
        shippingCharge: true,
        totalAmount: true,
        notes: true
      }
    })

    if (!response) {
      return Response.json({ ok: false, data: null, status: 500 })
    }

    const freeTrial = await checkApiLimit('RESEND_MAIL', orgId)
    const isPro = await checkSubscription(orgId)
    if (!freeTrial.ok && !isPro) {
      return Response.json({
        ok: false,
        data: 'Your free trial has ended for sending mail.',
        status: 402
      })
    }

    await InvoiceJobs.createMediaFromInvoiceDataJob(
      response.id,
      orgId,
      response
    )

    if (!isPro) {
      await increaseApiLimit('RESEND_MAIL', orgId)
    }

    return Response.json({
      ok: true,
      data: `INV-${response.invoiceNumber}`,
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
