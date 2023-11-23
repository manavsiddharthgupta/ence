import { DotsHorizontalIcon } from '@radix-ui/react-icons'
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
import { StatusBadge } from '@/components/status-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User2Icon } from 'lucide-react'

const InvoiceTable = () => {
  // revamp code
  return (
    <table className='w-full text-black dark:text-white'>
      <thead>
        <tr className='text-sm font-medium text-zinc-600/60 dark:text-zinc-400/70 border-b-[1px] border-zinc-200 dark:border-zinc-700/40'>
          <td className='p-3 w-[12%]'># Invoice</td>
          <td className='p-2 w-[25%]'>To</td>
          <td className='p-2 w-[13%]'>Date</td>
          <td className='p-2 w-[13%]'>Due Date</td>
          <td className='p-2 w-[10%]'>Status</td>
          <td className='p-2 w-[11%]'>Total</td>
          <td className='p-2 w-[11%]'>Due</td>
          <td className='p-2 w-[5%]'></td>
        </tr>
      </thead>
      <tbody>
        {sampleInvoices.map((invoice, ind) => {
          // Todo: sample data
          return (
            <tr
              key={ind}
              className={`text-sm ${
                ind !== sampleInvoices.length - 1
                  ? 'border-b-[1px] border-zinc-200 dark:border-zinc-700/40'
                  : ''
              }`}
            >
              <td className='p-3'>{invoice.invoiceNumber}</td>
              <td className='p-2'>
                <div className='flex items-center gap-2'>
                  <Avatar className='w-6 h-6'>
                    <AvatarImage />
                    <AvatarFallback>
                      <User2Icon size='16px' strokeWidth='1px' />
                    </AvatarFallback>
                  </Avatar>
                  <span className='w-[calc(100%-6)]'>
                    {invoice.customerName}
                  </span>
                </div>
              </td>
              <td className='p-2'>{invoice.date}</td>
              <td className='p-2'>{invoice.dueDate}</td>
              <td className='p-2'>
                <StatusBadge status={invoice.status} />
              </td>
              <td className='p-2'>{invoice.total}</td>
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
