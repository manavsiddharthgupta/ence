import NextAuth, { SessionStrategy } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'

export const authOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!!
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  session: {
    maxAge: 24 * 60 * 60,
    strategy: 'jwt' as SessionStrategy
  },
  callbacks: {}
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
