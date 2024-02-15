import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { uploadFilesToS3 } from 'helper/s3'
import { streamToBuffer } from '@/utils/buffer'
import { getOrgId } from '@/crud/organization'

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

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    if (!filename || !request.body) {
      return Response.json({ ok: false, data: null, status: 500 })
    }

    const bufferImageData = await streamToBuffer(request.body)
    const fileUrl = await uploadFilesToS3(
      'ence-invoice',
      filename,
      bufferImageData
    )
    console.log(fileUrl)
    return Response.json({
      ok: true,
      data: {
        url: fileUrl
      },
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ ok: false, data: null, status: 500 })
  }
}
