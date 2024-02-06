import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
    }
    const user = await db.user.findUnique({
      where: {
        email: email
      }
    })
    const id = user?.id
    if (!id) {
      console.error('Error:', 'User Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }
    const organization = await db.organization.findUnique({
      where: {
        createdById: id
      }
    })

    if (!organization) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const organizationName = organization?.orgName
    const userName = user?.name
    const emailAddress = user?.email
    const profilePic = user?.image

    const accountDetails = {
      organizationName,
      userName,
      emailAddress,
      profilePic
    }

    return Response.json({ ok: true, data: accountDetails, status: 200 })
  } catch (error) {
    console.error('Error fetching user details', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
    }
    const { organizationName, userName, image } = await request.json()

    if (!organizationName || !userName || !image) {
      console.error('Error:', 'Invalid Data')
      return Response.json({ ok: false, data: null, status: 400 })
    }

    const user = await db.user.findUnique({
      where: {
        email: email
      }
    })
    const id = user?.id
    if (!id) {
      console.error('Error:', 'User Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: { name: userName }
    })

    const organization = await db.organization.findUnique({
      where: {
        createdById: id
      }
    })

    if (!organization) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }

    await db.organization.update({
      where: { createdById: id },
      data: { orgName: organizationName }
    })

    return Response.json({ ok: true, data: updatedUser, status: 200 })
  } catch (error) {
    console.error('Error updating user details', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
