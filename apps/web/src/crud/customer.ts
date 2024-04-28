import { db } from '@/lib/db'
import { getOrgId } from './organization'

export const getCustomers = async (
  email: string | null | undefined,
  query: string | null
) => {
  try {
    if (!email) {
      console.error('Error:', 'Not Authorized')
      return JSON.stringify({ ok: false, data: null, status: 401 })
    }
    const orgId = await getOrgId(email)

    if (!orgId) {
      console.error('Error:', 'Organization Not Found')
      return JSON.stringify({ ok: false, data: null, status: 404 })
    }

    const response = await db.customerInfo.findMany({
      where: {
        organisationId: orgId
      },
      select: {
        id: true,
        email: true,
        whatsAppNumber: true,
        legalName: true
      }
    })

    return JSON.stringify({ ok: true, data: response, status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return JSON.stringify({ ok: false, data: null, status: 500 })
  }
}
