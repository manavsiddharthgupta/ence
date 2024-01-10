import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { InvoiceBody } from '@/types/invoice'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email

    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
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
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const body = await request.json()
    const {
      dateIssue,
      dueDate,
      customerInfo,
      invoiceNumber,
      paymentMethod,
      paymentStatus,
      paymentTerms,
      sendingMethod,
      invoiceTotal,
      subTotal,
      totalAmount,
      dueAmount,
      items,
      instantInvoiceLink
    } = body as InvoiceBody

    const invoiceRes = await db.invoice.create({
      data: {
        customerInfo: customerInfo,
        dateIssue: dateIssue,
        dueDate: dueDate,
        invoiceNumber: invoiceNumber,
        organizationId: org.organizations.id,
        dueAmount: dueAmount,
        totalAmount: totalAmount,
        invoiceTotal: invoiceTotal,
        subTotal: subTotal,
        auditTrailEntries: {
          create: {
            actionType: 'INVOICE_CREATION'
          }
        },
        paymentMethod: paymentMethod,
        instantInvoiceLink: instantInvoiceLink,
        approvalStatus: 'APPROVED', // Todo: rmv, this will be done by customer
        paymentStatus: paymentStatus,
        paymentTerms: paymentTerms,
        sendingMethod: sendingMethod,
        items: {
          createMany: {
            data: items
          }
        }
      }
    })

    // Todo: create link for customer and send them based on sending method
    return Response.json({
      ok: true,
      data: {
        invoiceNumber: invoiceRes.invoiceNumber,
        sendingMethod: invoiceRes.sendingMethod,
        paymentStatus: invoiceRes.paymentStatus,
        dueAmount: invoiceRes.dueAmount,
        dueDate: invoiceRes.dueDate
      },
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
