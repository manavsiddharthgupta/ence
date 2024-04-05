'use client'
import { Theme, ThemeProvider } from '@/context/theme'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './sidebar'
import { Toaster } from '@/components/ui/sonner'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'

const Card = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark)

  useEffect(() => {
    const existedTheme =
      localStorage.getItem('theme') === Theme.Light ? Theme.Light : Theme.Dark
    if (existedTheme) {
      setTheme(existedTheme)
    }
  }, [])

  const pathname = usePathname()
  if (pathname.startsWith('/auth')) {
    return (
      <body className='bg-zinc-900 text-white'>
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
        <body className={className}>
          <main className='px-4 py-8 min-h-screen dark:text-white overflow-x-auto'>
            {children}
          </main>
          <Toaster />
        </body>
      </ThemeProvider>
    )
  }

  if (pathname.startsWith('/manual')) {
    return (
      <ThemeProvider value={{ theme: theme, setTheme: onSetTheme }}>
        <body className={className}>
          <main className='px-4 py-8 min-h-screen dark:text-white overflow-x-auto'>
            {children}
          </main>
          <Toaster />
        </body>
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

  return (
    <ThemeProvider value={{ theme: theme, setTheme: onSetTheme }}>
      <body className={className}>
        <ResizablePanelGroup direction='horizontal' className='w-full'>
          <ResizablePanel defaultSize={17.5} minSize={17.5}>
            <Sidebar onChangeThemeHandler={onSetTheme} />
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className='dark:bg-zinc-800/90 bg-zinc-200/90'
          />
          <ResizablePanel defaultSize={82.5} minSize={80}>
            <main className='px-4 py-8 min-h-screen dark:text-white overflow-x-auto'>
              {children}
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
        <Toaster />
      </body>
    </ThemeProvider>
  )
}

export default Card
