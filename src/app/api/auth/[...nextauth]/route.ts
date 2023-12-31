import NextAuth, { SessionStrategy, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from '@/lib/db'
import { ALLOWED_USER } from '@/lib/constants'

const isAllowedUser = (email: string | undefined | null) => {
  if (!email) {
    return null
  }
  const userEmailname = email.split('@')[0]
  console.log('your username ->', userEmailname)
  return ALLOWED_USER.includes(userEmailname)
} // Todo: Currently in dev mode will be removed

export const authOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!!
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    maxAge: 24 * 60 * 60,
    strategy: 'jwt' as SessionStrategy
  },
  callbacks: {
    signIn({ user }: { user: User }) {
      if (!isAllowedUser(user?.email)) {
        return false
      }
      return true
    } // Todo: Currently in dev mode will be removed
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
