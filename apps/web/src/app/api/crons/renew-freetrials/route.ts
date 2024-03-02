import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs'

async function handler(req: NextRequest) {
  const body = await req.json()
  try {
    await db.userAPILimit.updateMany({
      data: {
        count: 0
      }
    })
    return NextResponse.json({
      ok: true,
      data: 'Your cron job for renewing free trial is done',
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      ok: false,
      data: null,
      status: 500
    })
  }
}

export const POST = verifySignatureAppRouter(handler)
