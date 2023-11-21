import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import { sampleInvoices } from '@/lib/sample'

const InvoiceTable = () => {
  return (
    <table className='w-full'>
      <thead>
        <tr className='text-sm font-medium text-zinc-600/60 dark:text-zinc-400/70 border-b-[1px] border-zinc-200 dark:border-zinc-700/40'>
          <td className='p-3 w-[12%]'># Invoice</td>
          <td className='p-2 w-[33%]'>To</td>
          <td className='p-2 w-[15%]'>Date</td>
          <td className='p-2 w-[15%]'>Due Date</td>
          <td className='p-2 w-[10%]'>Status</td>
          <td className='p-2 w-[10%]'>Due</td>
          <td className='p-2 w-[5%]'></td>
        </tr>
      </thead>
      <tbody>
        {sampleInvoices.map((invoice, ind) => {
          // Todo: sample data
          return (
            <tr
              className={`text-xs ${
                ind !== sampleInvoices.length - 1
                  ? 'border-b-[1px] border-zinc-200 dark:border-zinc-700/40'
                  : ''
              }`}
            >
              <td className='p-3'>{invoice.invoiceNumber}</td>
              <td className='p-2'>{invoice.customerName}</td>
              <td className='p-2'>{invoice.date}</td>
              <td className='p-2'>{invoice.dueDate}</td>
              <td className='p-2'>
                <StatusBadge status={invoice.status} />
              </td>
              <td className='p-2'>{invoice.due}</td>
              <td className=''>
                <div className='hover:dark:bg-zinc-700/20 hover:bg-zinc-300/30 transition-all duration-100 ease-in-out cursor-pointer w-fit py-1 px-2 rounded-sm'>
                  <DotsHorizontalIcon />
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default InvoiceTable

const StatusBadge = ({ status }: { status: string }) => {
  let className = ''
  switch (status) {
    case 'Paid':
      className = 'bg-emerald-600 hover:bg-emerald-700'
      break
    case 'Pending':
      className = 'bg-yellow-600 hover:bg-yellow-700'
      break
    case 'Unpaid':
      className = 'bg-red-600 hover:bg-red-700'
      break
    case 'Partially':
      className = 'bg-blue-600 hover:bg-blue-700'
      break
    default:
      break
  }
  return <Badge className={'text-white ' + className}>{status}</Badge>
}
