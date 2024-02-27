export async function GET(request: Request) {
  const verify_token = process.env.WHATSAPP_VERIFICATION_TOKEN

  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      return new Response(`${challenge}`, { status: 200 })
    } else {
      return new Response('Failed to verify webhook', { status: 403 })
    }
  }
}

// Todo:
export async function POST(request: Request) {
  const whatsapp_token = process.env.WHATSAPP_TOKEN
  // do something
  try {
    const requestBody = await request.json()
    return Response.json({
      ok: true,
      data: requestBody,
      status: 200
    })
  } catch (err) {
    return Response.json({
      ok: false,
      data: null,
      status: 500
    })
  }
}
