import { Separator } from '@/components/ui/separator'
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

const Invoice = ({ invoiceNumber }: { invoiceNumber: number | null }) => {
  return (
    <SheetContent className='w-full sm:max-w-5xl'>
      <div className='w-full flex justify-between'>
        <div className='w-1/2'>
          <SheetHeader>
            <SheetTitle className='text-lg'>
              Invoice info{' '}
              <span className='text-base font-bold'>#INV-{invoiceNumber}</span>
            </SheetTitle>
            <Separator className='my-6 h-[0.5px] dark:bg-zinc-700 bg-zinc-300' />
          </SheetHeader>
        </div>
        <div className='w-[45%]'>
          <SheetHeader>
            <SheetTitle className='text-lg'>Preview</SheetTitle>
            <SheetDescription className='text-xs'>
              See Invoice overview and audit trail.
            </SheetDescription>
          </SheetHeader>
        </div>
      </div>
    </SheetContent>
  )
}

export default Invoice
