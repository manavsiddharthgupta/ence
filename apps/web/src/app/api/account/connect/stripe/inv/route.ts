import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getOrgId } from '@/crud/organization'
import { db } from '@/lib/db'
import { type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
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

    const account = await db.stripeAccount.findMany({
      where: {
        organisationId: orgId
      },
      select: {
        id: true,
        apiToken: true
      }
    })

    if (!account || account.length === 0) {
      return Response.json({ ok: false, data: null, status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const customerEmail = searchParams.get('query')

    const stripe = new Stripe(account[0].apiToken)
    const customersRes = await stripe.customers.search({
      query: `email~"${customerEmail}"`
    })

    const customers = customersRes.data
    if (customers.length < 1) {
      return Response.json({ ok: false, data: null, status: 401 })
    }

    const invoices = await Promise.all(
      customers.map(async (customer) => {
        const invoices = await stripe.invoices.search({
          query: `customer:"${customer.id}"`
        })
        return invoices.data
      })
    )

    return Response.json({
      ok: true,
      data: invoices,
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
