'use client'
import { Theme, ThemeProvider } from '@/context/theme'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './sidebar'

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
      <body>
        <main className='min-h-screen bg-zinc-900 text-white'>{children}</main>
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

  return (
    <ThemeProvider value={{ theme: theme, setTheme: onSetTheme }}>
      <body className={className}>
        <Sidebar onChangeThemeHandler={onSetTheme} />
        <main className='ml-56 px-4 py-8 min-h-screen dark:text-white overflow-x-auto'>
          {children}
        </main>
      </body>
    </ThemeProvider>
  )
}

export default Card
