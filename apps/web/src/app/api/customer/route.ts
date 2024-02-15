import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { Customer } from '@/types/invoice'
import { getOrgId } from '@/crud/organization'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
    }
    const orgId = await getOrgId(email)

    if (!orgId) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const response = await db.customerInfo.findMany({
      where: {
        organisationId: orgId
      },
      select: {
        id: true,
        email: true,
        legalName: true,
        whatsAppNumber: true
      }
    })

    return Response.json({ ok: true, data: response, staus: 200 })
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
    const orgId = await getOrgId(email)

    if (!orgId) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const data: Customer = await request.json()
    const customerRes = await db.customerInfo.create({
      data: {
        organisationId: orgId,
        legalName: data.legalName,
        email: data.email,
        whatsAppNumber: data.whatsAppNumber
      }
    })
    return Response.json({
      ok: true,
      data: customerRes,
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
