import { db } from '@/lib/db'
import { redis } from '@/lib/redis'

export const getOrgId = async (userEmail: string) => {
  const orgExistInRedis = await getOrgIdFromRedis(userEmail)
  if (orgExistInRedis) {
    return orgExistInRedis
  }

  const orgExistInDB = await getOrgIdFromDB(userEmail)
  if (orgExistInDB) {
    await setOrgIdInRedis(userEmail, orgExistInDB)
    return orgExistInDB
  }

  return null
}

export const setOrgIdInRedis = async (userEmail: string, orgId: string) => {
  await redis.set(`ORG:USER:${userEmail}`, orgId)
}

export const getOrgIdFromRedis = async (userEmail: string) => {
  try {
    const key = `ORG:USER:${userEmail}`
    const orgId: string | null = await redis.get(key)
    return orgId
  } catch (err) {
    console.error('Error while checking if Organization exist', err)
    return
  }
}

export const getOrgIdFromDB = async (userEmail: string) => {
  try {
    if (!userEmail) {
      return null
    }
    const org = await db.user.findUnique({
      where: {
        email: userEmail
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
    return org?.organizations?.id ?? null
  } catch (err) {
    console.error('Error while checking if Organization exist', err)
    return
  }
}
