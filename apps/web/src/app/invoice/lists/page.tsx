import Image from 'next/image'
import InvoiceTable from './invoices-table'
import Overview from './overview'
import err from '@/svgs/err.svg'
import { Suspense } from 'react'
import { ChevronDown, Loader2Icon, ReceiptText, Zap } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getInvoices, getInvoicesOverview } from '@/crud/invoices'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

const Invoices = () => {
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <div className='flex justify-between items-center'>
        <div>
          <p className='text-xs leading-3 text-zinc-600/80 dark:text-zinc-300/80 font-medium'>
            Overview
          </p>
          <h1 className='text-4xl leading-9 font-semibold'>Invoice Lists</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className='rounded-full bg-transparent hover:bg-transparent dark:text-white text-black border-2 dark:border-zinc-700/50 border-zinc-300/50 font-semibold'
              variant='default'
            >
              New Invoice
              <ChevronDown size={14} className='ml-2' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-48 rounded-xl dark:border-zinc-700/60 border-zinc-300/60 bg-white dark:bg-zinc-950 p-2'>
            <DropdownMenuLabel className='text-xs'>
              CREATE NEW INVOICE
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-zinc-600/20' />
            <DropdownMenuItem asChild>
              <Link className='cursor-pointer' href='/manual/invoice'>
                <ReceiptText size={16} strokeWidth={2} className='mr-4' />
                Manually Create
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className='cursor-pointer' href='/instant/invoice'>
                <Zap size={16} className='mr-4' />
                Instantly Create
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Suspense
        fallback={
          <div className='py-6 w-full flex justify-center'>
            <div className='w-fit h-fit flex items-center gap-2 '>
              <Loader2Icon className='animate-spin' />
              <p className='text-sm font-semibold'>Getting invoices...</p>
            </div>
          </div>
        }
      >
        <Lists />
      </Suspense>
    </div>
  )
}

export default Invoices

const Lists = async () => {
  const getInvoiceLists = async () => {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const response = await getInvoices(email)
    return JSON.parse(response)
  }

  const getInvoiceListsOverview = async () => {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const response = await getInvoicesOverview(email)
    return JSON.parse(response)
  }

  const invoiceOverview = await getInvoiceListsOverview()
  const invoiceLists = await getInvoiceLists()
  return (
    <>
      <Overview overview={invoiceOverview.data} />
      {invoiceLists.ok ? (
        <InvoiceTable lists={invoiceLists.data} />
      ) : (
        <div className='py-6'>
          <Image
            src={err}
            alt='error'
            width={424}
            height={424}
            className='mx-auto'
          />
        </div>
      )}
    </>
  )
}
