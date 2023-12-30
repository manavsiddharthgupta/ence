import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { put } from '@vercel/blob'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email

    if (!email) {
      console.error('Error:', 'Not Authorized')
      return Response.json({ ok: false, data: null, status: 401 })
    }

    const org = await db.user.findUnique({
      where: {
        email: email
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

    if (!org?.organizations?.id) {
      console.error('Error:', 'Organization Not Found')
      return Response.json({ ok: false, data: null, status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    if (!filename || !request.body) {
      return Response.json({ ok: false, data: null, status: 500 })
    }

    console.log('File Name', filename)

    const url = await put(filename, request.body, {
      access: 'public'
    })

    console.log('URL', url)

    return Response.json({ ok: true, data: url, status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}

// user -> image -> Vercel -> link -> ocr_service -> data_res -> validation -> data_return
