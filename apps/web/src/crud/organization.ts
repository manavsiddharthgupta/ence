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

export const getAccountDetailsFromDB = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    })

    const organization = await db.organization.findUnique({
      where: {
        createdById: user?.id
      },
      select: {
        orgName: true
      }
    })

    const accountDetails = {
      name: user?.name,
      email: user?.email,
      profilePic: user?.image,
      orgName: organization?.orgName
    }

    return accountDetails
  } catch (error) {
    console.error('Error fetching account details from DB', error)
    return null
  }
}

export const updateAccountDetailsInDB = async (
  email: string,
  userName: string,
  organizationName: string
) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email: email
      }
    })
    const id = user?.id
    if (!id) {
      console.error('Error:', 'User Not Found')
      return null
    }

    const updatedUser = await db.user.update({
      where: { id },
      select: {
        name: true
      },
      data: {
        name: userName
      }
    })

    const updatedOrganization = await db.organization.update({
      where: {
        createdById: id
      },
      select: {
        orgName: true
      },
      data: {
        orgName: organizationName
      }
    })

    const updatedAccountInfo = { updatedUser, updatedOrganization }

    return updatedAccountInfo
  } catch (error) {
    console.error('Error updating user details', error)
    return null
  }
}
