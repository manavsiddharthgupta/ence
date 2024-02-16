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
        email
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    })

    if (!user) {
      console.error('Error:', 'User Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const organization = await db.organization.findUnique({
      where: {
        createdById: user?.id
      },
      select: {
        orgName: true
      }
    })

    if (!organization) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const accountDetails = {
      organizationName: organization?.orgName,
      userName: user?.name,
      userId: user?.id,
      emailAddress: user?.email,
      profilePic: user?.image
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
    const { organizationName, userName } = await request.json()
    console.log('organizationName:', organizationName)
    console.log('userName:', userName)

    if (!organizationName || !userName) {
      console.error('Error:', 'Invalid Data')
      return Response.json({
        ok: false,
        data: {
          organizationName,
          userName
        },
        status: 400
      })
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
      data: {
        name: userName,
        organizations: {
          update: {
            orgName: organizationName
          }
        }
      }
    })

    return Response.json({ ok: true, data: updatedUser, status: 200 })
  } catch (error) {
    console.error('Error updating user details', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
