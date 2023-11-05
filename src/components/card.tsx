'use client'
import { Theme, ThemeProvider } from '@/context/theme'
import { useState } from 'react'
import Sidebar from './sidebar'

const Card = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark)
  const onSetTheme = () => {
    setTheme((prevState: Theme) => {
      if (prevState === Theme.Dark) {
        return Theme.Light
      }
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
