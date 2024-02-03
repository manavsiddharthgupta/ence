import Image from 'next/image'
import InvoiceTable from './invoices-table'
import Overview from './overview'
import err from '@/svgs/err.svg'
import { Suspense } from 'react'
import { Loader2Icon } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getInvoices, getInvoicesOverview } from '@/crud/invoices'

const Invoices = () => {
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <p className='text-xs leading-3 text-zinc-600/80 dark:text-zinc-300/80 font-medium'>
        Overview
      </p>
      <h1 className='text-4xl leading-9 font-semibold'>Invoice Lists</h1>
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
