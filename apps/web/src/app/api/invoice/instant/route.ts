import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { InvoiceBody } from '@/types/invoice'
import { getOrgId } from '@/crud/organization'

export async function POST(request: Request) {
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

    const body = await request.json()
    const {
      dateIssue,
      dueDate,
      customerId,
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
        customerId: customerId,
        dateIssue: dateIssue,
        dueDate: dueDate,
        invoiceNumber: invoiceNumber,
        organizationId: orgId,
        dueAmount: dueAmount,
        totalAmount: totalAmount,
        invoiceTotal: invoiceTotal,
        subTotal: subTotal,
        auditTrailEntries: {
          createMany: {
            data: [
              {
                actionType: 'INSTANT_CREATION',
                title: 'Instant Invoice Creation',
                description:
                  'An invoice has been swiftly generated through an automated, instant creation process.',
                oldStatus: 'N/A',
                newStatus: 'Unapproved'
              },
              {
                actionType: 'APPROVAL_ACTION',
                title: 'Customer Approval of Invoice',
                description: 'Customer has officially approved the invoice.',
                oldStatus: 'Unapproved',
                newStatus: 'Approved'
              } // Todo: rmv, this will be done by customer
            ]
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
