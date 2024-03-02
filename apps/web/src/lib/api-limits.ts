import { APILimit } from 'database'
import { db } from './db'
import { MAX_FREE_COUNT } from './constants'

export const increaseApiLimit = async (
  type: APILimit,
  orgId: string | null
) => {
  if (!orgId) {
    console.error('Error:', 'Organization Not Found')
    return { ok: false, data: null, status: 404 }
  }

  const userApiLimit = await db.userAPILimit.findUnique({
    where: {
      organizationId_type: {
        organizationId: orgId,
        type: type
      }
    }
  })
  if (userApiLimit) {
    await db.userAPILimit.update({
      where: {
        organizationId_type: {
          organizationId: orgId,
          type: type
        }
      },
      data: {
        count: { increment: 1 }
      }
    })
    return { ok: true, data: 'update', status: 200 }
  } else {
    await db.userAPILimit.create({
      data: {
        organizationId: orgId,
        type: type,
        count: 1
      }
    })
    return { ok: true, data: 'create', status: 200 }
  }
}

export const checkApiLimit = async (type: APILimit, orgId: string | null) => {
  if (!orgId) {
    console.error('Error:', 'Organization Not Found')
    return { ok: false, data: null, status: 404 }
  }

  const MAX_COUNT =
    type === 'INSTANT_INVOICE'
      ? MAX_FREE_COUNT.INSTANT_INVOICE
      : MAX_FREE_COUNT.RESEND_MAIL

  const userApiLimit = await db.userAPILimit.findUnique({
    where: {
      organizationId_type: {
        organizationId: orgId,
        type: type
      }
    }
  })

  if (!userApiLimit || userApiLimit.count < MAX_COUNT) {
    return { ok: true, data: null, status: 200 }
  } else {
    return { ok: false, data: null, status: 200 }
  }
}
