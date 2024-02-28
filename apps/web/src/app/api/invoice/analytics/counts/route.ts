import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { getOrgId } from '@/crud/organization'
export const dynamic = 'force-dynamic'
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

    const totalInvoices = await db.invoice.count({
      where: {
        organizationId: orgId
      }
    })
    const paidInvoices = await db.invoice.count({
      where: {
        organizationId: orgId,
        paymentStatus: 'PAID'
      }
    })
    const unpaidInvoices = await db.invoice.count({
      where: {
        organizationId: orgId,
        paymentStatus: 'DUE'
      }
    })
    // amount
    const totalAmountAll = await db.invoice.aggregate({
      where: {
        organizationId: orgId
      },
      _sum: {
        totalAmount: true
      }
    })
    const totalAmountPaid = await db.invoice.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        organizationId: orgId,
        paymentStatus: 'PAID'
      }
    })
    const totalAmountUnpaid = await db.invoice.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        organizationId: orgId,
        paymentStatus: 'DUE'
      }
    })
    return Response.json({
      ok: true,
      data: {
        all: {
          count: totalInvoices,
          sum: totalAmountAll._sum.totalAmount
        },
        paid: {
          count: paidInvoices,
          sum: totalAmountPaid._sum.totalAmount
        },
        unpaid: {
          count: unpaidInvoices,
          sum: totalAmountUnpaid._sum.totalAmount
        }
      },
      status: 200
    })
  } catch (error) {
    console.error('Error retrieving invoice statistics:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
