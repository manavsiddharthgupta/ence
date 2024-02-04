export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/invoice/:path*',
    '/',
    '/onboarding',
    '/instant/:path*',
    '/home',
    '/api:path*'
  ]
}
