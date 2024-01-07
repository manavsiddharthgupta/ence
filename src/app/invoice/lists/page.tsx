import Image from 'next/image'
import InvoiceTable from './invoices-table'
import Overview from './overview'
import err from '@/svgs/err.svg'
export const dynamic = 'force-dynamic'
const getInvoiceOverview = async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/api/invoice/overview'
  )
  const overviewRes = await response.json()
  return overviewRes
}

const getInvoices = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/invoice')
  const invoicesResponse = await response.json()
  return invoicesResponse
}

const Lists = async () => {
  const invoiceOverview = await getInvoiceOverview()
  const invoiceLists = await getInvoices()

  return (
    <div className='w-full max-w-4xl mx-auto'>
      <p className='text-xs leading-3 text-zinc-600/80 dark:text-zinc-300/80 font-medium'>
        Overview
      </p>
      <h1 className='text-4xl leading-9 font-semibold'>Invoice Lists</h1>
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
    </div>
  )
}

export default Lists
