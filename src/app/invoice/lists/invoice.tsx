import Tip from '@/components/component-tip'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { formatAmount } from '@/lib/helpers'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { Banknote, Bell, Calendar, Info, UserCircleIcon } from 'lucide-react'

const Invoice = ({ invoiceNumber }: { invoiceNumber: number | null }) => {
  return (
    <SheetContent className='w-full sm:max-w-5xl'>
      <div className='w-full flex justify-between h-full'>
        <div className='w-1/2 overflow-y-auto h-full'>
          <SheetHeader>
            <SheetTitle className='flex justify-between items-center'>
              <p className='text-xl font-medium'>
                Invoice info{' '}
                <span className='text-base font-bold'>
                  #INV-{invoiceNumber}
                </span>
              </p>
              <StatusBadge status='overdue' />
            </SheetTitle>
            <Separator className='my-6 h-[0.5px] dark:bg-zinc-700 bg-zinc-300' />
          </SheetHeader>
          <div className='mt-4 mb-8 grid justify-between grid-cols-3 gap-y-8 gap-x-2'>
            <InvoiceField fieldName='Invoice Number' fieldValue='INV-3' />
            <InvoiceField
              fieldName='Issue Date'
              fieldValue='4 Dec 2023'
              type='date'
            />
            <InvoiceField
              fieldName='Customer'
              fieldValue='Gopal Stores'
              type='user'
            />
            <InvoiceField fieldName='Payment Term' fieldValue='Custom' />
            <InvoiceField
              fieldName='Due Date'
              fieldValue='4 Dec 2023'
              type='date'
            />
            <InvoiceField fieldName='Status' fieldValue='Overdue by 12d' />
            <InvoiceField fieldName='Payment Method' fieldValue='Cash' />
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex gap-2 items-center'>
              <Banknote size={26} className='text-green-500' />
              <h3 className='font-semibold dark:text-zinc-50/50 text-zinc-900/60'>
                Payable Amount
              </h3>
              <span className='font-bold text-xl text-black dark:text-white'>
                {formatAmount(13199)}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='text-xs items-center gap-2 px-6 h-9 dark:bg-transparent dark:hover:bg-zinc-800/50 dark:border-zinc-600/30 border-zinc-400/30'
              >
                <Bell size={12} />
                <p>Send Payment Reminder</p>
                <Badge className='text-[10px] leading-[14px] px-2'>Cash</Badge>
              </Button>
              <Tip info='Update/Edit Invoice Details'>
                <div className='p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-md transition-all ease-in-out duration-75'>
                  <Pencil2Icon width='16' height='16' />
                </div>
              </Tip>
            </div>
          </div>
          <div className='my-8'>
            <h3 className='font-medium'>Amount Details</h3>
            <div className='pt-4 flex flex-col gap-2.5'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2 text-zinc-900/60 dark:text-white/50'>
                  <h3 className='text-xs font-medium'>Invoice Total</h3>
                  <Tip info='Subtotal + GST - Discount'>
                    <Info size={10} strokeWidth={2.5} className='mt-0.5' />
                  </Tip>
                </div>
                <h2 className='text-lg font-bold'>{formatAmount(13000)}</h2>
              </div>
              <div className='flex justify-between items-center'>
                <h3 className='text-xs font-medium text-zinc-900/60 dark:text-white/50'>
                  Shipping Charge
                </h3>
                <h2 className='text-lg font-bold'>{formatAmount(199)}</h2>
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2 text-zinc-900/60 dark:text-white/50'>
                  <h3 className='text-xs font-medium'>Amount to consumer</h3>
                  <Tip info='Invoice Total + Shipping Charge'>
                    <Info size={10} strokeWidth={2.5} className='mt-0.5' />
                  </Tip>
                </div>
                <h2 className='text-lg font-bold'>{formatAmount(13199)}</h2>
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2 text-zinc-900/60 dark:text-white/50'>
                  <h3 className='text-xs font-medium'>Amount Paid</h3>
                  <Tip info='Amount that is already paid by consumer'>
                    <Info size={10} strokeWidth={2.5} className='mt-0.5' />
                  </Tip>
                </div>
                <h2 className='text-lg font-bold'>{formatAmount(0)}</h2>
              </div>
              <Separator className='h-[0.5px] dark:bg-zinc-700 bg-zinc-300' />
              <div className='flex justify-between'>
                <div className='flex items-center gap-2 text-zinc-900/60 dark:text-white/50'>
                  <h3 className='text-xs font-medium'>Amount Payable</h3>
                  <Tip info='Amount to consumer - Amount paid'>
                    <Info size={10} strokeWidth={2.5} className='mt-0.5' />
                  </Tip>
                </div>
                <h2 className='text-lg font-bold'>{formatAmount(13199)}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className='w-[45%]'>
          <SheetHeader>
            <SheetTitle className='text-lg'>Preview</SheetTitle>
            <SheetDescription className='text-xs'>
              See Invoice overview and audit trail.
            </SheetDescription>
          </SheetHeader>
          <div className='my-4 py-8'>
            <p className='text-xs text-center font-medium'>Coming Soon...</p>
          </div>
        </div>
      </div>
    </SheetContent>
  )
}

export default Invoice

const InvoiceField = ({
  fieldName,
  fieldValue,
  type
}: {
  fieldName: string
  fieldValue: string
  type?: 'default' | 'date' | 'user'
}) => {
  if (type === 'date') {
    return (
      <div className='flex flex-col gap-1 font-semibold text-xs w-fit'>
        <p className='dark:text-zinc-50/50 text-zinc-900/60'>{fieldName}</p>
        <div className='flex items-center gap-2'>
          <Calendar size={14} color='#8f8f8f' />
          <p className=''>{fieldValue}</p>
        </div>
      </div>
    )
  }

  if (type === 'user') {
    return (
      <div className='flex flex-col gap-1 font-semibold text-xs w-fit'>
        <p className='dark:text-zinc-50/50 text-zinc-900/60'>{fieldName}</p>
        <div className='flex items-center gap-2'>
          <UserCircleIcon size={15} color='#8f8f8f' />
          <p className=''>{fieldValue}</p>
        </div>
      </div>
    )
  }
  return (
    <div className='flex flex-col gap-1 font-semibold text-xs w-fit'>
      <p className='dark:text-zinc-50/50 text-zinc-900/60'>{fieldName}</p>
      <p className=''>{fieldValue}</p>
    </div>
  )
}
