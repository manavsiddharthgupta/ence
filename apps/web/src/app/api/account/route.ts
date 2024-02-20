import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import {
  getAccountDetailsFromDB,
  getOrgId,
  updateAccountDetailsInDB
} from '@/crud/organization'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
    }

    let accountDetails
    const orgId = await getOrgId(email)

    if (orgId) {
      accountDetails = await getAccountDetailsFromDB(email)
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

    const updatedUser = await updateAccountDetailsInDB(
      email,
      userName,
      organizationName
    )

    return Response.json({ ok: true, data: updatedUser, status: 200 })
  } catch (error) {
    console.error('Error updating user details', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
