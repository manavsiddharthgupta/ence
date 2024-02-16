import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { InvoiceBody } from '@/types/invoice'
import { InvoiceJobs } from 'events/jobs-publisher'
import { getOrgId } from '@/crud/organization'
import { uploadFilesToS3 } from 'helper/s3'
import { InvoiceGenerateMedia } from 'media-generator'

export async function GET() {
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

    const response = await db.invoice.findMany({
      where: {
        organizationId: orgId
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
                actionType: 'MANUAL_CREATION',
                title: 'Invoice Manually Created',
                description: 'You manually created a new invoice.',
                oldStatus: 'N/A',
                newStatus: 'Unapproved'
              }
            ]
          }
        },
        paymentMethod: paymentMethod,
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

    // await InvoiceJobs.createMediaFromInvoiceDataJob(
    //   invoiceRes.id,
    //   orgId,
    //   invoiceRes
    // )

    const imageBuffer = await InvoiceGenerateMedia.generateImage(invoiceRes)
    const fileUrl = await uploadFilesToS3(
      'ence-invoice',
      invoiceRes.id,
      imageBuffer
    )
    if (!fileUrl) {
      console.error('Error while uploading invoice image to s3')
    } else {
      console.log(fileUrl)
    }

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
