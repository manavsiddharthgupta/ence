import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log(request.nextUrl.pathname)
  // request if user has access to this page
  return NextResponse.next()
}

export const config = {
  matcher: ['/home', '/invoice/:path*', '/']
}
