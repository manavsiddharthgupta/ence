import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!
  try {
    const buf = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      if (err! instanceof Error) console.log(err)
      console.log(`Error message: ${errorMessage}`)
      return Response.json({
        ok: false,
        data: `Webhook Error: ${errorMessage}`,
        status: 400
      })
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id)

    // getting to the data we want from the event
    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === 'checkout.session.completed') {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      if (!session.metadata?.orgId) {
        return Response.json({
          ok: false,
          data: 'Org Id is required.',
          status: 400
        })
      }
      await db.userSubscription.create({
        data: {
          organizationId: session.metadata?.orgId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          )
        }
      })
    }

    if (event.type === 'invoice.payment_succeeded') {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )
      await db.userSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          )
        }
      })
    }
    return Response.json({
      ok: true,
      data: 'Success',
      status: 200
    })
  } catch {
    return Response.json({
      ok: false,
      data: null,
      status: 500
    })
  }
}
