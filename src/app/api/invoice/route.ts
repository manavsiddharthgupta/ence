import {getServerSession} from 'next-auth'
import {authOptions} from '../auth/[...nextauth]/route'
import {db} from '@/lib/db'
import {InvoiceBody} from '@/types/invoice'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ok: false, data: null, status: 401})
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
      return Response.json({ok: false, data: null, status: 404})
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

    return Response.json({ok: true, data: response, status: 200})
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ok: false, data: null, status: 500})
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email

    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ok: false, data: null, status: 401})
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
      return Response.json({ok: false, data: null, status: 404})
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
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        paymentTerms: paymentTerms,
        sendingMethod: sendingMethod,
        adjustmentFee: adjustmentFee,
        notes: notes,
        shippingCharge,
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
    return Response.json({ok: false, data: null, status: 500})
  }
}
