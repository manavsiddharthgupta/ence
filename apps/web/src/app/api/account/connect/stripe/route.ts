import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getOrgId } from '@/crud/organization'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'

export async function GET(request: Request) {
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

    const response = await db.stripeAccount.findMany({
      where: {
        organisationId: orgId
      },
      select: {
        id: true,
        apiToken: true,
        accountId: true
      }
    })
    return Response.json({
      ok: true,
      data: response,
      status: 200
    })
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
    const { apiToken } = body

    const stripe = new Stripe(apiToken)
    const stripeAccount = await stripe.accounts.retrieve()
    if (!stripeAccount.id) {
      return Response.json({ ok: false, data: null, status: 401 })
    }
    const response = await db.stripeAccount.create({
      data: {
        organisationId: orgId,
        apiToken: apiToken,
        accountId: stripeAccount.id
      }
    })
    return Response.json({
      ok: true,
      data: {
        id: response.id
      },
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
