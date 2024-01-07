import Image from 'next/image'
import InvoiceTable from './invoices-table'
import Overview from './overview'
import err from '@/svgs/err.svg'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { Loader2Icon } from 'lucide-react'
export const dynamic = 'force-dynamic'

const getInvoiceOverview = async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/api/invoice/overview',
    {
      method: 'GET',
      cache: 'no-store',
      headers: headers()
    }
  )
  const overviewRes = await response.json()
  return overviewRes
}

const getInvoices = async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/api/invoice',
    {
      method: 'GET',
      cache: 'no-store',
      headers: headers()
    }
  )
  const invoicesResponse = await response.json()
  return invoicesResponse
}

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
  const invoiceOverview = await getInvoiceOverview()
  const invoiceLists = await getInvoices()
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
