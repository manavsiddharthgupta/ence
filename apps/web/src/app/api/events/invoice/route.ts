import { NextRequest, NextResponse } from 'next/server'
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs'

async function handler(_req: NextRequest) {
  console.log('BODY --->', _req.body)
  return NextResponse.json({ name: 'John Doe ' })
}

export const POST = verifySignatureAppRouter(handler)
