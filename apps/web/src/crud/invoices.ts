import { db } from '@/lib/db'
import { Invoice } from 'database'
export const getInvoices = async (email: string | null | undefined) => {
  try {
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return JSON.stringify({ ok: false, data: null, status: 401 })
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
      return JSON.stringify({ ok: false, data: null, status: 404 })
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
        totalAmount: true,
        approvalStatus: true
      }
    })

    return JSON.stringify({ ok: true, data: response, status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return JSON.stringify({ ok: false, data: null, status: 500 })
  }
}

export const getInvoicesOverview = async (email: string | null | undefined) => {
  try {
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return JSON.stringify({ ok: false, data: null, status: 401 })
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
      return JSON.stringify({ ok: false, data: null, status: 404 })
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

    const getTotalCount = (invoices: Invoice[], status: string) =>
      invoices.filter((invoice) => invoice.paymentStatus === status).length

    const totalCountCurrentWeek = {
      paid: getTotalCount(currentWeekInvoices, 'PAID'),
      due: getTotalCount(currentWeekInvoices, 'DUE'),
      overdue: getTotalCount(currentWeekInvoices, 'OVERDUE'),
      partiallyPaid: getTotalCount(currentWeekInvoices, 'PARTIALLY_PAID')
    }

    const totalCountAllTime = {
      paid: getTotalCount(allInvoices, 'PAID'),
      due: getTotalCount(allInvoices, 'DUE'),
      overdue: getTotalCount(allInvoices, 'OVERDUE'),
      partiallyPaid: getTotalCount(allInvoices, 'PARTIALLY_PAID')
    }

    const percentageChange = {
      paid: calculatePercentageChange(
        totalCountAllTime.paid - totalCountCurrentWeek.paid,
        totalCountCurrentWeek.paid
      ),
      due: calculatePercentageChange(
        totalCountAllTime.due - totalCountCurrentWeek.due,
        totalCountCurrentWeek.due
      ),
      overdue: calculatePercentageChange(
        totalCountAllTime.overdue - totalCountCurrentWeek.overdue,
        totalCountCurrentWeek.overdue
      ),
      partiallyPaid: calculatePercentageChange(
        totalCountAllTime.partiallyPaid - totalCountCurrentWeek.partiallyPaid,
        totalCountCurrentWeek.partiallyPaid
      )
    }

    return JSON.stringify({
      ok: true,
      data: {
        totalCountAllTime,
        totalCountCurrentWeek,
        percentageChange
      },
      status: 200
    })
  } catch (error) {
    console.error('Error retrieving invoice statistics:', error)
    return JSON.stringify({ ok: false, data: null, status: 500 })
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

export const getOverview = async (email: string | null | undefined) => {
  try {
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return JSON.stringify({ ok: false, data: null, status: 401 })
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
      return JSON.stringify({ ok: false, data: null, status: 404 })
    }

    // count
    const totalInvoices = await db.invoice.count({
      where: {
        organizationId: org.organizations.id
      }
    })
    const paidInvoices = await db.invoice.count({
      where: {
        organizationId: org.organizations.id,
        paymentStatus: 'PAID'
      }
    })
    const unpaidInvoices = await db.invoice.count({
      where: {
        organizationId: org.organizations.id,
        paymentStatus: 'DUE'
      }
    })
    // amount
    const totalAmountAll = await db.invoice.aggregate({
      where: {
        organizationId: org.organizations.id
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
        organizationId: org.organizations.id,
        paymentStatus: 'PAID'
      }
    })
    const totalAmountUnpaid = await db.invoice.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        organizationId: org.organizations.id,
        paymentStatus: 'DUE'
      }
    })
    return JSON.stringify({
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
    return JSON.stringify({ ok: false, data: null, status: 500 })
  }
}

export const getActivity = async (email: string | null | undefined) => {
  try {
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return JSON.stringify({ ok: false, data: null, status: 401 })
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
      return JSON.stringify({ ok: false, data: null, status: 404 })
    }

    const lastActivities = await db.auditTrail.findMany({
      where: {
        invoice: {
          organizationId: org.organizations.id
        }
      },
      select: {
        title: true,
        actionType: true,
        id: true,
        createdAt: true,
        description: true,
        newStatus: true,
        invoice: {
          select: {
            invoiceNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 4
    })

    return JSON.stringify({
      ok: true,
      data: lastActivities,
      status: 200
    })
  } catch (error) {
    console.error('Error retrieving invoice statistics:', error)
    return JSON.stringify({ ok: false, data: null, status: 500 })
  }
}
