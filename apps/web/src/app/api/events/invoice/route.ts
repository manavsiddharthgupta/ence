import { NextRequest, NextResponse } from 'next/server'
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs'
import { Processor } from 'events/jobs-processor'

async function handler(req: NextRequest) {
  const body = await req.json()
  console.log('job body --->', body)
  await Processor.handleMessage(body)
  return NextResponse.json({
    ok: true,
    data: 'job received successfully',
    status: 200
  })
}

export const POST = verifySignatureAppRouter(handler)
