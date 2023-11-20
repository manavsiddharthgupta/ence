import { Switch } from '@/components/ui/switch'
import { Separator } from './ui/separator'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  FileTextIcon,
  PlusIcon,
  MinusIcon,
  CornerBottomLeftIcon
} from '@radix-ui/react-icons'
import { useState } from 'react'
import { Theme, useTheme } from '@/context/theme'
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from './ui/button'
import { LogOut, Settings } from 'lucide-react'

const Sidebar = ({
  onChangeThemeHandler
}: {
  onChangeThemeHandler: () => void
}) => {
  const { theme } = useTheme()
  const { data: session } = useSession()
  console.log(session) //Todo : remove
  return (
    <nav className='border-r-2 dark:border-zinc-800/90 border-zinc-200/90 border-white bg-zinc-50 dark:bg-zinc-900 w-56 h-screen px-4 dark:text-white fixed left-0 top-0'>
      <div className='h-[calc(100%-112px)] pt-8'>
        <h1 className='font-bold text-lg text-center'>ENCE</h1>
        <div className='h-[calc(100%-28px)] overflow-y-auto py-4'>
          <SideItems />
        </div>
      </div>
      <div className='h-8 flex flex-col justify-between'>
        <div className=' flex items-center justify-center'>
          <Switch
            checked={theme === Theme.Light}
            onCheckedChange={onChangeThemeHandler}
          />
        </div>
        <Separator className='dark:bg-zinc-700 bg-zinc-300 h-[0.5px]' />
      </div>
      <div className='h-16 pb-4 flex items-end truncate'>
        <div className='flex gap-4 items-center px-3'>
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className='w-9 h-9'>
                <AvatarImage
                  src={session?.user?.image || 'https://github.com/shadcn.png'}
                />
                <AvatarFallback>T</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className='w-52 dark:border-zinc-600 border-zinc-400 dark:bg-zinc-900 bg-white'>
              <Button
                className='w-full bg-transparent border-none hover:bg-zinc-100/80 hover:dark:bg-zinc-800/50 justify-start gap-4'
                variant='outline'
                size='sm'
              >
                <Settings size='16px' />
                <span className='text-xs font-medium'>Manage</span>
              </Button>
              <Button
                onClick={() => signOut()}
                className='w-full bg-transparent border-none hover:bg-zinc-100/80 hover:dark:bg-zinc-800/50 justify-start gap-4'
                variant='outline'
                size='sm'
              >
                <LogOut size='16px' />
                <span className='text-xs font-medium'>SignOut</span>
              </Button>
            </PopoverContent>
          </Popover>
          <div>
            <p className='text-sm font-medium'>{session?.user?.name || '-'}</p>
            <p className='text-xs leading-3 font-medium text-zinc-600 dark:text-zinc-400'>
              Test Org
            </p>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Sidebar

const SideItems = () => {
  const [collapse, setCollapse] = useState<null | string>()
  const router = useRouter()
  const pathname = usePathname()
  const items = [
    {
      label: 'Home',
      to: '/home',
      icon: <HomeIcon />
    },
    {
      label: 'Invoice',
      to: '/invoice',
      icon: <FileTextIcon />,
      subType: {
        status: true,
        values: [{ label: 'Create', to: '/invoice/create' }]
      }
    }
    // {
    //   label: 'Customer',
    //   to: '/customer',
    //   icon: <FileTextIcon />,
    //   subType: {
    //     status: true,
    //     values: [{ label: 'Crete', to: '/create' }]
    //   }
    // }
    // { label: 'Customers', to: '/customers' },
    // { label: 'Products', to: '/products' },
    // { label: 'Setting', to: '/setting' }
  ]

  return (
    <ul className='flex flex-col gap-3'>
      {items.map((item) => {
        if (item.subType?.status) {
          return (
            <li key={item.label}>
              <button
                className='text-sm font-medium w-full text-left px-3 py-2 rounded-md flex items-center justify-between hover:dark:bg-zinc-600/20 hover:bg-zinc-200/50'
                onClick={() => {
                  if (item.to === collapse) {
                    setCollapse(null)
                  } else {
                    setCollapse(item.to)
                  }
                }}
              >
                <div className='flex items-center gap-2'>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.to === collapse ? <MinusIcon /> : <PlusIcon />}
              </button>
              {item.to === collapse &&
                item.subType.values.map((subItem) => {
                  return (
                    <div
                      key={subItem.label}
                      className='flex gap-4 items-center px-3 text-sm mt-2'
                    >
                      <CornerBottomLeftIcon />
                      <button
                        className={`w-[calc(100%-31px)] text-left px-3 py-2 rounded-md font-medium ${
                          pathname === subItem.to
                            ? 'dark:bg-white dark:text-black bg-black text-white'
                            : 'hover:dark:bg-zinc-600/20 hover:bg-zinc-200/50'
                        }`}
                        onClick={() => router.push(subItem.to)}
                      >
                        {subItem.label}
                      </button>
                    </div>
                  )
                })}
            </li>
          )
        }
        return (
          <li key={item.label}>
            <button
              className={`text-sm font-medium w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
                pathname === item.to
                  ? 'dark:bg-white dark:text-black bg-black text-white'
                  : 'hover:dark:bg-zinc-600/20 hover:bg-zinc-200/50'
              }`}
              onClick={() => router.push(item.to)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
