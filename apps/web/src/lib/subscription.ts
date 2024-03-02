import { db } from './db'

const DAY_IN_MS = 86_400_000
export const checkSubscription = async (orgId: string) => {
  const userSubscriptions = await db.userSubscription.findUnique({
    where: {
      organizationId: orgId
    },
    select: {
      stripeCustomerId: true,
      stripePriceId: true,
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true
    }
  })

  if (!userSubscriptions) {
    return false
  }

  const isValid =
    userSubscriptions.stripePriceId &&
    userSubscriptions.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now()

  return !!isValid
}
