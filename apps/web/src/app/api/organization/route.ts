import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { OrganizationBody } from '@/types/organization'
import { redis } from '@/lib/redis'

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
    const sanitizedOrganization = {
      ...organization,
      whatsappNumber: Number(organization.whatsappNumber)
    }
    return Response.json({ ok: true, data: sanitizedOrganization, staus: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
    }
    const data = await request.json()
    const {
      orgName,
      whatsApp,
      website,
      email: orgEmail,
      gstin,
      pan,
      businessType,
      businessRegistrationNumber,
      currencyType,
      address
    } = data as OrganizationBody
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
        createdById: id,
        whatsappNumber: whatsApp,
        address: address,
        website: website,
        businessRegistrationNumber: businessRegistrationNumber,
        email: orgEmail,
        gstin: gstin,
        pan: pan,
        businessType: businessType,
        currencyType: currencyType
      }
    })

    if (orgResponse.orgName) {
      const res = await redis.set(`ORG:USER:${email}`, orgResponse.orgName)
    }

    return Response.json({
      ok: true,
      data: { orgName: orgResponse.orgName, state: orgResponse.state },
      staus: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
