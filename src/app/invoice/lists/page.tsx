import InvoiceTable from './invoices-table'
import Overview from './overview'

const Lists = () => {
  // will have to revamp code
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <p className='text-xs leading-3 text-zinc-600/80 dark:text-zinc-300/80 font-medium'>
        Overview
      </p>
      <h1 className='text-4xl leading-9 font-semibold'>Invoice Lists</h1>
      <Overview />
      <InvoiceTable />
    </div>
  )
}

export default Lists
