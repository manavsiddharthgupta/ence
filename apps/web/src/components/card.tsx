'use client'
import { Theme, ThemeProvider } from '@/context/theme'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './sidebar'
import { Toaster } from '@/components/ui/sonner'
import { Terminal } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ORG_INFO, OrgInfoProvider } from '@/context/org-info'

const Card = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark)
  const [smallScreenAlert, setShowAlert] = useState(false)
  const [orgInfo, setOrgInfo] = useState<ORG_INFO>({
    avatar: '',
    orgName: '-',
    currency_type: '☒',
    isPro: false
  })

  useEffect(() => {
    const existedTheme =
      localStorage.getItem('theme') === Theme.Light ? Theme.Light : Theme.Dark
    if (existedTheme) {
      setTheme(existedTheme)
    }
  }, [])

  useEffect(() => {
    const getOrgDetails = async () => {
      const response = await fetch('/api/organization/info')
      const orgInfoRes = await response.json()
      if (!orgInfoRes.ok) {
        setOrgInfo({
          avatar: '',
          orgName: '-',
          currency_type: '☒',
          isPro: false
        })
        return
      }
      setOrgInfo({
        avatar: orgInfoRes?.data.avatar || '',
        currency_type: orgInfoRes?.data.currency_type || '☒',
        isPro: orgInfoRes?.data.isPro || false,
        orgName: orgInfoRes?.data.orgName || '-'
      })
    }
    getOrgDetails()
  }, [])

  useEffect(() => {
    function handleResize() {
      const width = +window.innerWidth
      if (width <= 1024) {
        setShowAlert(true)
      } else {
        setShowAlert(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const pathname = usePathname()
  if (pathname.startsWith('/auth')) {
    return (
      <body className='bg-white text-black'>
        <main className='min-h-screen'>{children}</main>
      </body>
    )
  }

  if (pathname.startsWith('/onboarding')) {
    return (
      <body className='bg-zinc-900 text-white'>
        <main className='min-h-screen'>{children}</main>
      </body>
    )
  }

  const onSetTheme = () => {
    setTheme((prevState: Theme) => {
      if (prevState === Theme.Dark) {
        localStorage.setItem('theme', Theme.Light)
        return Theme.Light
      }
      localStorage.setItem('theme', Theme.Dark)
      return Theme.Dark
    })
  }

  const className =
    theme === Theme.Dark ? ' dark bg-zinc-900 w-full' : ' w-full'

  if (pathname.startsWith('/instant')) {
    return (
      <ThemeProvider value={{ theme: theme, setTheme: onSetTheme }}>
        <OrgInfoProvider value={{ orgInfo, setOrgInfo }}>
          <body className={className}>
            <main className='px-4 py-8 min-h-screen dark:text-white overflow-x-auto'>
              {children}
            </main>
            <Toaster />
          </body>
        </OrgInfoProvider>
      </ThemeProvider>
    )
  }

  if (pathname.startsWith('/manual')) {
    return (
      <ThemeProvider value={{ theme: theme, setTheme: onSetTheme }}>
        <OrgInfoProvider value={{ orgInfo, setOrgInfo }}>
          <body className={className}>
            <main className='px-4 py-8 min-h-screen dark:text-white overflow-x-auto'>
              {children}
            </main>
            <Toaster />
          </body>
        </OrgInfoProvider>
      </ThemeProvider>
    )
  }

  if (pathname.startsWith('/invoice-approval')) {
    return (
      <body>
        <main className='px-4 py-8 min-h-screen bg-white overflow-x-auto flex justify-center items-center dot bg-[radial-gradient(black_1px,transparent_0)]'>
          {children}
        </main>
        <Toaster />
      </body>
    )
  }

  if (smallScreenAlert) {
    return (
      <ThemeProvider value={{ theme: theme, setTheme: onSetTheme }}>
        <body className={className}>
          <main className='min-h-screen flex justify-center items-center px-6'>
            <SmallerScreenAlert />
          </main>
        </body>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider value={{ theme: theme, setTheme: onSetTheme }}>
      <OrgInfoProvider value={{ orgInfo, setOrgInfo }}>
        <body className={className}>
          <Sidebar onChangeThemeHandler={onSetTheme} />
          <main className='ml-56 px-4 py-8 min-h-screen dark:text-white overflow-x-auto'>
            {children}
          </main>
          <Toaster />
        </body>
      </OrgInfoProvider>
    </ThemeProvider>
  )
}

export default Card

export function SmallerScreenAlert() {
  return (
    <Alert className='dark:bg-zinc-950 max-w-sm mb-6 border border-zinc-400/20 dark:border-zinc-600/20 p-6'>
      <Terminal className='h-4 w-4' />
      <AlertTitle>Screen Size Alert!</AlertTitle>
      <AlertDescription>
        You are using a small screen. Please adjust your settings for optimal
        viewing.
      </AlertDescription>
    </Alert>
  )
}
