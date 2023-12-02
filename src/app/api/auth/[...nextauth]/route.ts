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
  callbacks: {
    // async session({ session }: { session: Session }) {
    //   if (!session || !session.user?.email) {
    //     return session
    //   }
    //   console.log(session)
    //   const userExist = await db.user.findUnique({
    //     where: {
    //       email: session.user?.email
    //     }
    //   })
    //   if (!userExist) {
    //     session.expires = Date.now().toString()
    //     return session
    //   }
    //   return session
    // }
    // Todo: will update the functionality - will use jwt
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
