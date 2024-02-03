import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { InvoiceBody } from '@/types/invoice'
import { InvoiceJobs } from '@/sqs/events/invoice-job'

export async function GET() {
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

    const response = await db.invoice.findMany({
      where: {
        organizationId: org.organizations.id
      },
      select: {
        id: true,
        invoiceNumber: true,
        customerInfo: true,
        dateIssue: true,
        dueDate: true,
        paymentStatus: true,
        dueAmount: true,
        totalAmount: true
      }
    })

    return Response.json({ ok: true, data: response, status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}

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
      notes,
      paymentMethod,
      paymentStatus,
      paymentTerms,
      sendingMethod,
      shippingCharge,
      packagingCharge,
      invoiceTotal,
      subTotal,
      totalAmount,
      dueAmount,
      adjustmentFee,
      items
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
          createMany: {
            data: [
              {
                actionType: 'MANUAL_CREATION',
                title: 'Invoice Manually Created',
                description: 'You manually created a new invoice.',
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
        approvalStatus: 'APPROVED', // Todo: rmv, this will be done by customer
        paymentStatus: paymentStatus,
        paymentTerms: paymentTerms,
        sendingMethod: sendingMethod,
        adjustmentFee: adjustmentFee,
        notes: notes,
        shippingCharge,
        packagingCharge,
        items: {
          createMany: {
            data: items
          }
        }
      },
      select: {
        id: true,
        invoiceNumber: true,
        dateIssue: true,
        dueDate: true,
        customerInfo: true,
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

    await InvoiceJobs.createMediaFromInvoiceDataJob(
      invoiceRes.id,
      org.organizations.id,
      invoiceRes
    )
    // Todo: create link for customer and send them based on sending method
    return Response.json({
      ok: true,
      data: {
        invoiceNumber: invoiceRes.invoiceNumber,
        dueDate: invoiceRes.dueDate
      },
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
