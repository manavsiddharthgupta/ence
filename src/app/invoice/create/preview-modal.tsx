import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Mail, Download, MessageCircle } from 'lucide-react'

const PreviewModal = () => {
  return (
    <DialogContent className='bg-white dark:bg-zinc-900 dark:border-zinc-700 border-zinc-200 max-w-3xl'>
      <DialogHeader>
        <DialogTitle className='flex items-center justify-between pb-4'>
          <p className='font-bold text-3xl'>
            Invoice
            <span className='text-lg font-medium ml-2'>#inv-25725</span>
          </p>
          <div className='mr-6 flex gap-3'>
            <IconCard tipMessage='Download Invoice'>
              <Download className='w-3.5 h-3.5' />
            </IconCard>
            <IconCard tipMessage='Send Mail'>
              <Mail className='w-3.5 h-3.5' />
            </IconCard>
            <IconCard tipMessage='Send Whatsapp'>
              <MessageCircle className='w-3.5 h-3.5' />
            </IconCard>
          </div>
        </DialogTitle>
        <div className='overflow-y-auto h-80'>
          <InvoiceFormat />
        </div>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            type='button'
            variant='secondary'
            className='dark:bg-zinc-900 dark:hover:bg-zinc-800/50 dark:border-zinc-700 border-zinc-200 border cursor-pointer hover:bg-zinc-100'
          >
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

export default PreviewModal

const IconCard = ({
  children,
  tipMessage
}: {
  children: React.ReactNode
  tipMessage: string
}) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger>
          <div className='p-2 rounded-full dark:bg-zinc-900 dark:hover:bg-zinc-800/50 dark:border-zinc-700 border-zinc-200 border cursor-pointer hover:bg-zinc-100'>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent className='bg-white dark:bg-zinc-900 dark:border-zinc-800 border-zinc-200 text-xs'>
          <p>{tipMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const InvoiceFormat = () => {
  return (
    <div className='border border-black max-w-xl mx-auto min-h-[320px] bg-white text-black py-4 relative'>
      <p className='font-semibold text-[9px] absolute top-1 right-2'>
        ORIGINAL FOR RECIPIENT
      </p>
      <div className='px-4'>
        <div className='flex justify-between items-center'>
          <p className='font-medium text-xl'>Ence Interprises</p>
          <h1 className='text-3xl font-bold'>E</h1>
        </div>
        <div className='flex justify-between items-start'>
          <p className='font-bold text-xs'>#25725</p>
          <div className='text-right text-[10px]'>
            <p className='font-semibold'>
              Issue Date: <span className='text-black/60'>22-09-2023</span>
            </p>
            <p className='font-semibold'>
              Due Date: <span className='text-black/60'>01-01-2024</span>
            </p>
          </div>
        </div>
      </div>
      <Separator className='my-2 h-[0.5px]' />
      <div className='px-4'>
        <div className='w-full truncate text-[10px]'>
          <p className='font-semibold'>
            Customer Name:{' '}
            <span className='font-normal ml-2'>Test Customer</span>
          </p>
          <p className='font-semibold'>
            Customer Address:{' '}
            <span className='font-normal ml-2'>
              Test City, Test State, India
            </span>
          </p>
        </div>
      </div>
      <div className='px-4 my-6 w-full min-h-[100px]'>
        <table className='w-full text-[10px]'>
          <thead>
            <tr>
              <th className='w-[5%] text-black/50'>#</th>
              <th className='w-[70%] text-black/50'>Item</th>
              <th className='w-[10%] text-black/50'>Qty</th>
              <th className='w-[15%] text-black/50 text-right'>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td className='font-semibold'>Test Products 1</td>
              <td>4</td>
              <td className='text-right font-semibold'>₹ 44.00</td>
            </tr>
            <tr>
              <td>2</td>
              <td className='font-semibold'>Test Products 2</td>
              <td>9</td>
              <td className='text-right font-semibold'>₹ 72.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='px-4'>
        <Separator className='h-[0.5px] bg-slate-300' />
        <div className='flex justify-end'>
          <div className='w-40 mt-1 px-2'>
            <div className='flex justify-between font-bold text-xs'>
              <h1>Total</h1>
              <h1>₹ 116.00</h1>
            </div>
            <div className='flex justify-between text-[10px] relative'>
              <span className='absolute -left-4 top-1/2 -translate-y-1/2 leading-3 font-bold'>
                +
              </span>
              <h1>Tax</h1>
              <h1>₹ 16.00</h1>
            </div>
            <div className='flex justify-between text-[10px] relative'>
              <span className='absolute -left-4 top-1/2 -translate-y-1/2 leading-3 font-bold'>
                -
              </span>
              <h1>Discount</h1>
              <h1>₹ 18.00</h1>
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <div className='w-40 flex justify-between font-bold text-sm border-slate-300 mt-1 border-t-[1.5px] px-2'>
            <h1>Sub Total</h1>
            <h1>₹ 114.00</h1>
          </div>
        </div>
        <p className='text-[8px] text-right'>
          SubTotal (in words) : One Hundred Fourteen Rupees Only.
        </p>
        <Separator className='h-[0.5px] bg-slate-300' />
        <p className='text-xs font-semibold text-right'>
          Amount Payable <span className='ml-6'>₹ 114.00</span>
        </p>
        <div className='mt-6 flex justify-between'>
          <div className='text-[10px] w-28'>
            <p className='font-medium leading-3'>
              Notes:{' '}
              <span className='font-light text-[9px] leading-3'>
                something crazy has happend...
              </span>
            </p>
          </div>
          <div className='w-24 h-24 rounded-full border-[1.5px] border-black p-1'>
            <div className='rounded-full border-[1px] border-black border-dashed h-full flex justify-center items-center'>
              <h1 className='text-xl font-bold -rotate-12'>Paid</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
