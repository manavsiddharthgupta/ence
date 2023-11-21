import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import { sampleInvoices } from '@/lib/sample'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

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
              key={ind}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='flex h-8 w-8 p-0 data-[state=open]:bg-zinc-600/20 hover:bg-zinc-600/10'
                    >
                      <DotsHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='dark:border-zinc-700/60 border-zinc-300/60 bg-white dark:bg-zinc-900'>
                    <DropdownMenuLabel>Invoice Action</DropdownMenuLabel>
                    <DropdownMenuSeparator className='bg-zinc-600/20' />
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Make a Copy</DropdownMenuItem>
                    <DropdownMenuSeparator className='bg-zinc-600/20' />
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
