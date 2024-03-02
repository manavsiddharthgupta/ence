import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { getOrgId } from '@/crud/organization'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

const returnURL = `${process.env.NEXT_PUBLIC_API_URL}/home`
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

    const userSubscriptionRes = await db.userSubscription.findUnique({
      where: {
        organizationId: orgId
      }
    })

    if (userSubscriptionRes && userSubscriptionRes.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscriptionRes.stripeCustomerId,
        return_url: returnURL
      })

      return Response.json({ ok: true, data: stripeSession.url, status: 200 })
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: returnURL,
      cancel_url: returnURL,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'required',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'INR',
            product_data: {
              name: 'Ence Pro',
              description: 'Unlimited Instant Creation and Mail Automation'
            },
            unit_amount: 199900,
            recurring: {
              interval: 'year'
            }
          },
          quantity: 1
        }
      ],
      metadata: {
        orgId
      }
    })

    return Response.json({ ok: true, data: stripeSession.url, status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
