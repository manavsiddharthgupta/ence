import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
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
        <DialogDescription className='overflow-y-auto h-80'>
          <p className='border border-black max-w-xl mx-auto h-[700px] bg-white'></p>
        </DialogDescription>
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
