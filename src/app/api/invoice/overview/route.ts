import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '../../auth/[...nextauth]/route'
import { Invoice } from '@prisma/client'

export const dynamic = 'force-dynamic'
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

    const allInvoices: Invoice[] = await db.invoice.findMany({
      where: {
        organizationId: org.organizations.id
      }
    })

    const currentWeekInvoices: Invoice[] = await db.invoice.findMany({
      where: {
        organizationId: org.organizations.id,
        dateIssue: {
          gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    })

    const previousWeekInvoices = await db.invoice.findMany({
      where: {
        organizationId: org.organizations.id,
        dateIssue: {
          gte: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
          lt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })

    const getTotalCount = (invoices: Invoice[], status: string) =>
      invoices.filter((invoice) => invoice.paymentStatus === status).length

    const totalCountAllTime = {
      paid: getTotalCount(allInvoices, 'PAID'),
      due: getTotalCount(allInvoices, 'DUE'),
      overdue: getTotalCount(allInvoices, 'OVERDUE'),
      partiallyPaid: getTotalCount(allInvoices, 'PARTIALLY_PAID')
    }

    const totalCountCurrentWeek = {
      paid: getTotalCount(currentWeekInvoices, 'PAID'),
      due: getTotalCount(currentWeekInvoices, 'DUE'),
      overdue: getTotalCount(currentWeekInvoices, 'OVERDUE'),
      partiallyPaid: getTotalCount(currentWeekInvoices, 'PARTIALLY_PAID')
    }

    const totalCountPreviousWeek = {
      paid: getTotalCount(previousWeekInvoices, 'PAID'),
      due: getTotalCount(previousWeekInvoices, 'DUE'),
      overdue: getTotalCount(previousWeekInvoices, 'OVERDUE'),
      partiallyPaid: getTotalCount(previousWeekInvoices, 'PARTIALLY_PAID')
    }

    const percentageChange = {
      paid: calculatePercentageChange(
        totalCountPreviousWeek.paid,
        totalCountCurrentWeek.paid
      ),
      due: calculatePercentageChange(
        totalCountPreviousWeek.due,
        totalCountCurrentWeek.due
      ),
      overdue: calculatePercentageChange(
        totalCountPreviousWeek.overdue,
        totalCountCurrentWeek.overdue
      ),
      partiallyPaid: calculatePercentageChange(
        totalCountPreviousWeek.partiallyPaid,
        totalCountCurrentWeek.partiallyPaid
      )
    }

    return Response.json({
      ok: true,
      data: {
        totalCountAllTime,
        totalCountCurrentWeek,
        totalCountPreviousWeek,
        percentageChange
      },
      status: 200
    })
  } catch (error) {
    console.error('Error retrieving invoice statistics:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }

  function calculatePercentageChange(
    previousValue: number,
    currentValue: number
  ): number | null {
    if (previousValue === 0) {
      return currentValue === 0 ? 0 : null
    }

    const rawPercentageChange =
      ((currentValue - previousValue) / Math.abs(previousValue)) * 100

    return parseFloat(rawPercentageChange.toFixed(2))
  }
}
