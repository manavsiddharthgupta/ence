'use client'
import { SessionProvider } from 'next-auth/react'
import QueryProvider from '@/components/react-query'

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
  )
}

export default Provider
