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

const Sidebar = ({
  onChangeThemeHandler
}: {
  onChangeThemeHandler: () => void
}) => {
  return (
    <nav className='border-r-2 dark:border-zinc-800/90 border-zinc-200/90 border-white bg-zinc-50 dark:bg-zinc-900 w-56 h-screen px-4 dark:text-white fixed left-0 top-0'>
      <div className='h-[73%] pt-8'>
        <h1 className='font-bold text-lg text-center'>ENCE</h1>
        <div className='h-[calc(100%-28px)] overflow-y-auto py-4'>
          <SideItems />
        </div>
      </div>
      <div className='h-[7%] flex flex-col justify-between'>
        <div className=' flex items-center justify-center'>
          <Switch onCheckedChange={onChangeThemeHandler} />
        </div>
        <Separator className='dark:bg-zinc-700 bg-zinc-300 h-[0.5px]' />
      </div>
      <div className='h-[20%] pb-8'></div>
    </nav>
  )
}
export default Sidebar

const SideItems = () => {
  const [collapse, setCollapse] = useState<null | string>()
  const router = useRouter()
  const pathname = usePathname()
  console.log(collapse)
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
        values: [{ label: 'Create', to: '/create-invoice' }]
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
