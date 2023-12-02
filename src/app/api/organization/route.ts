import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { Organization } from '@prisma/client'

export async function GET() {
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
  console.log(organization, 'org created while onBoarding') // Todo: remove
  if (!organization) {
    console.error('Error:', 'Organization Not Found')
    return Response.json({ ok: false, data: null, status: 404 })
  }
  return Response.json({ ok: true, data: organization, staus: 200 })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) {
    console.error('Error:', 'Not Authorized')
    return Response.json({ ok: false, data: null, status: 401 })
  }
  const data = await request.json()
  const { orgName } = data as Organization
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

  const orgResponse = await db.organization.create({
    data: {
      orgName: orgName,
      createdById: id
    }
  })

  return Response.json({
    ok: true,
    data: { orgName: orgResponse.orgName, state: orgResponse.state },
    staus: 200
  })
}