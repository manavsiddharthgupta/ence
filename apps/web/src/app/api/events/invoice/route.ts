import { NextRequest, NextResponse } from 'next/server'
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs'
import { Processor } from 'events/jobs-processor'

async function handler(_req: NextRequest) {
  console.log('job body --->', _req.body)
  await Processor.handleMessage(_req.body)
  return NextResponse.json({
    ok: true,
    data: 'job received sucessfully',
    status: 200
  })
}

export const POST = verifySignatureAppRouter(handler)
