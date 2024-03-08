import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { InvoiceBody } from '@/types/invoice'
import { getOrgId } from '@/crud/organization'
import { InvoiceJobs } from 'events/jobs-publisher'
import { checkApiLimit, increaseApiLimit } from '@/lib/api-limits'
import { checkSubscription } from '@/lib/subscription'
import jwt from 'jsonwebtoken'

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
                newStatus: 'CREATED'
              }
            ]
          }
        },
        notes: 'Thank you for your business! We appreciate your trust.', // Todo: remove this
        paymentMethod: paymentMethod,
        instantInvoiceLink: instantInvoiceLink,
        paymentStatus: paymentStatus,
        paymentTerms: paymentTerms,
        sendingMethod: sendingMethod,
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

    const tokenForApprove = jwt.sign(
      {
        invoiceId: invoiceRes?.id,
        status: 'APPROVED',
        orgId: invoiceRes?.organization?.id
      },
      process.env.INVOICE_APPROVAL_SECRET_KEY || '',
      { expiresIn: '24h' }
    )

    const tokenForReject = jwt.sign(
      {
        invoiceId: invoiceRes?.id,
        status: 'REJECTED',
        orgId: invoiceRes?.organization?.id
      },
      process.env.INVOICE_APPROVAL_SECRET_KEY || '',
      { expiresIn: '24h' }
    )

    await db.tokens.createMany({
      data: [
        {
          invoiceId: invoiceRes?.id,
          target: tokenForApprove,
          type: 'INV_APPROVE'
        },
        {
          invoiceId: invoiceRes?.id,
          target: tokenForReject,
          type: 'INV_REJECT'
        }
      ]
    })

    // const freeTrial = await checkApiLimit('RESEND_MAIL', orgId)
    // const isPro = await checkSubscription(orgId)

    // if (!freeTrial.ok && !isPro) {
    //   return Response.json({
    //     ok: true,
    //     data: {
    //       invoiceNumber: invoiceRes.invoiceNumber,
    //       dueDate: invoiceRes.dueDate
    //     },
    //     status: 200
    //   })
    // }

    // await InvoiceJobs.createMediaFromInvoiceDataJob(
    //   invoiceRes.id,
    //   orgId,
    //   invoiceRes
    // )

    // if (!isPro) {
    //   await increaseApiLimit('RESEND_MAIL', orgId)
    // }

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
