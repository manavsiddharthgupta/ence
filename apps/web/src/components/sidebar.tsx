import { Switch } from '@/components/ui/switch'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  FileTextIcon,
  PlusIcon,
  MinusIcon,
  CornerBottomLeftIcon
} from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { Theme, useTheme } from '@/context/theme'
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import {
  CreditCard,
  FileMinus2,
  FilePlus2,
  LogOut,
  Rocket,
  Settings,
  Zap
} from 'lucide-react'
import { Beta } from './beta-badge'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import FreeTrialCount from './free-trial-count'
import { callErrorToast } from '@/lib/helpers'

const Sidebar = ({
  onChangeThemeHandler
}: {
  onChangeThemeHandler: () => void
}) => {
  const [orgName, setOrgName] = useState('-')
  const [isPro, setPro] = useState(false)
  const [loading, setLoading] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const { theme } = useTheme()
  const { data: session } = useSession()
  const route = useRouter()

  useEffect(() => {
    const getOrgDetails = async () => {
      setLoading(true)
      const response = await fetch('/api/organization')
      const organizationRes = await response.json()
      if (!organizationRes.ok) {
        setOrgName('-')
        setLoading(false)
        return
      }
      setOrgName(organizationRes.data?.orgName)
      setLoading(false)
    }
    getOrgDetails()
  }, [])

  useEffect(() => {
    const checkIfPro = async () => {
      const response = await fetch('/api/subscription')
      const res = await response.json()
      if (res.ok) {
        const isPro = !!res?.data?.isPro
        setPro(isPro)
      } else {
        setPro(false)
      }
    }
    checkIfPro()
  }, [])

  const onSubscribe = async () => {
    try {
      setUpgradeLoading(true)
      const response = await fetch('/api/stripe')
      const urlRes = await response.json()
      if (urlRes.ok) {
        const url = urlRes?.data || '/'
        route.push(url)
      } else {
        callErrorToast('Something went wrong, please try again.')
      }
    } catch (err) {
      console.error(err)
      callErrorToast('Something went wrong, please try again.')
    } finally {
      setUpgradeLoading(false)
    }
  }
  console.log(session) //Todo : remove
  return (
    <nav className='border-r-2 dark:border-zinc-800/90 border-zinc-200/90 border-white bg-zinc-50 dark:bg-zinc-900 w-56 h-screen px-4 dark:text-white fixed left-0 top-0'>
      <div className='h-[calc(100%-220px)] pt-8'>
        <div className='h-10 mb-2 flex items-center truncate'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex gap-4 items-center px-3 cursor-pointer'>
                <Avatar className='w-9 h-9'>
                  <AvatarImage
                    src={
                      session?.user?.image || 'https://github.com/shadcn.png'
                    }
                  />
                  <AvatarFallback>T</AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-medium'>
                    {session?.user?.name || '-'}
                  </p>
                  {loading ? (
                    <Skeleton className='rounded-md h-3 bg-gray-500/10' />
                  ) : (
                    <p className='text-xs leading-3 font-medium text-zinc-600 dark:text-zinc-400'>
                      {orgName}
                    </p>
                  )}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-52 dark:border-zinc-700/60 border-zinc-300/60 bg-white dark:bg-zinc-950 p-2'>
              <DropdownMenuItem className='flex gap-2 items-center p-2 cursor-pointer'>
                <Settings size='16px' />
                <span className='text-xs font-medium'>Manage</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='flex gap-2 items-center p-2 cursor-pointer'
                onClick={() => signOut()}
              >
                <LogOut size='16px' />
                <span className='text-xs font-medium'>SignOut</span>
              </DropdownMenuItem>
              {isPro ? (
                <DropdownMenuItem
                  onClick={onSubscribe}
                  disabled={upgradeLoading}
                  className='flex gap-2 items-center p-2 cursor-pointer'
                >
                  <CreditCard size='16px' />
                  <span className='text-xs font-medium'>Billing</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={onSubscribe}
                  disabled={upgradeLoading}
                  className='flex gap-2 items-center p-2 cursor-pointer'
                >
                  <Rocket size='16px' />
                  <span className='text-xs font-medium'>Upgrade</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='h-[calc(100%-28px)] overflow-y-auto py-4'>
          <SideItems />
        </div>
      </div>
      <FreeTrialCount isPro={isPro} />
      <div className='h-8 flex flex-col justify-between mt-4'>
        <div className=' flex items-center justify-center gap-1'>
          <Switch
            checked={theme === Theme.Light}
            onCheckedChange={onChangeThemeHandler}
          />
          <Popover>
            <PopoverTrigger asChild>
              <div className='flex items-center gap-1 rounded-3xl py-1 px-2 border dark:border-zinc-700 border-zinc-200 cursor-pointer'>
                <Zap size={14} strokeWidth={2} />
                <p className='text-xs font-medium'>Instant</p>
              </div>
            </PopoverTrigger>
            <PopoverContent
              side='top'
              align='start'
              className='w-fit flex flex-col p-1 dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900 bg-white shadow-none'
            >
              <Button
                asChild
                className='w-fit bg-transparent border-none hover:bg-white hover:dark:bg-zinc-900 justify-start gap-2 text-xs font-medium hover:text-sky-500'
                variant='outline'
                size='sm'
              >
                <Link href='/instant/invoice'>
                  <FilePlus2 size={14} strokeWidth={2} />
                  <p>Invoice</p>
                </Link>
              </Button>
              <Button
                className='w-fit bg-transparent border-none hover:bg-white hover:dark:bg-zinc-900 justify-start gap-2 text-xs font-medium hover:text-sky-500'
                variant='outline'
                size='sm'
                disabled
              >
                <Link className='flex gap-2' href='/instant/expense'>
                  <FileMinus2 size={14} strokeWidth={2} />
                  <p>Expense</p>
                </Link>
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* <Separator className='dark:bg-zinc-700/40 bg-zinc-300/40 h-[0.5px] mt-2' /> */}
      <h1 className='font-bold text-lg text-center'>ENCE</h1>
    </nav>
  )
}
export default Sidebar

type SidebarItems = {
  label: string
  to: string
  icon: JSX.Element
  subType?: {
    status: boolean
    values: {
      label: string
      to: string
    }[]
  }
}[]

const SideItems = () => {
  const [collapse, setCollapse] = useState<null | string>()
  const router = useRouter()
  const pathname = usePathname()
  const items: SidebarItems = [
    {
      label: 'Home',
      to: '/home',
      icon: <HomeIcon />
    },
    {
      label: 'Invoice',
      to: '/invoice/lists',
      icon: <FileTextIcon />
      // subType: {
      //   status: true,
      //   values: [
      //     { label: 'Lists', to: '/invoice/lists' },
      //     { label: 'Create', to: '/invoice/create' }
      //   ]
      // }
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
              <div
                className='text-sm font-medium w-full text-left px-3 py-2 rounded-md flex items-center justify-between hover:dark:bg-zinc-600/20 hover:bg-zinc-200/50 cursor-pointer'
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
              </div>
              {item.to === collapse &&
                item.subType.values.map((subItem) => {
                  return (
                    <div
                      key={subItem.label}
                      className='flex gap-4 items-center px-3 text-sm mt-2'
                    >
                      <CornerBottomLeftIcon />
                      <div
                        className={`w-[calc(100%-31px)] text-left px-3 py-2 cursor-pointer rounded-md font-medium flex items-center gap-2 ${
                          pathname === subItem.to
                            ? 'dark:bg-white dark:text-black bg-black text-white'
                            : 'hover:dark:bg-zinc-600/20 hover:bg-zinc-200/50'
                        }`}
                        onClick={() => router.push(subItem.to)}
                      >
                        <span>{subItem.label}</span>
                        {subItem.to === '/invoice/lists' && <Beta />}
                      </div>
                    </div>
                  )
                })}
            </li>
          )
        }
        return (
          <li key={item.label}>
            <div
              className={`text-sm font-medium w-full text-left px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer ${
                pathname === item.to
                  ? 'dark:bg-white dark:text-black bg-black text-white'
                  : 'hover:dark:bg-zinc-600/20 hover:bg-zinc-200/50'
              }`}
              onClick={() => router.push(item.to)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.to === '/home' && <Beta />}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
