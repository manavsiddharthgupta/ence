import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getOrgId } from '@/crud/organization'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
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

    return Response.json({
      ok: true,
      data: null,
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
