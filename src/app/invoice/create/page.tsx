'use client'
import { Separator } from '@/components/ui/separator'
import CustomerInfo from './customerInfo'
import BusinessInfo from './businessInfo'
import PaymentDetails from './paymentDetails'
import InvoiceInfo from './invoiceInfo'
import ItemsInfo from './itemsInfo'
import { formatAmount } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { useInvoiceContext } from '@/context/invoice'
import PreviewModal from './preview-modal'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'react-toastify'
import { useTheme } from '@/context/theme'

const createInvoice = () => {
  const {
    customerInfoState,
    customerLegalName,
    invoiceInfoState,
    itemsInfoState,
    paymentInfoState
  } = useInvoiceContext()
  const { theme } = useTheme()
  const separatorStyle = 'my-6 h-[0.5px] dark:bg-zinc-700 bg-zinc-300'
  return (
    <div className='relative w-full'>
      <div className='max-w-4xl w-full mx-auto pb-8'>
        <div className='mb-6'>
          <h1 className='text-4xl font-semibold'>Create your invoice</h1>
          <p className='text-xs font-medium mt-2'>
            Fill in the fields, preview your invoice and get it emailed or
            whatsapp directly to you.
          </p>
        </div>
        <div className='w-full flex justify-between items-center'>
          <h2 className='text-3xl font-medium'>Ence Interprises</h2>
          <h1 className='text-5xl font-bold'>E</h1>
        </div>
        <Separator className='my-4 dark:bg-zinc-700 bg-zinc-300' />
        <div className='flex justify-between'>
          <div className='w-[45%]'>
            <BusinessInfo />
          </div>
          <div className='w-[45%]'>
            <CustomerInfo />
          </div>
        </div>
        <Separator className={separatorStyle} />
        <div>
          <InvoiceInfo />
        </div>
        <Separator className={separatorStyle} />
        <div>
          <ItemsInfo />
        </div>
        <Separator className={separatorStyle} />
        <div>
          <PaymentDetails />
        </div>
      </div>
      <div className='fixed w-[calc(100%-14rem)] bottom-0 left-56 dark:bg-zinc-900 bg-white z-40 px-4'>
        <Separator className='h-0.5 dark:bg-zinc-800/90 bg-zinc-200/90' />
        <div className='flex items-center justify-between max-w-4xl w-full mx-auto py-4'>
          <div>
            <p className='text-xs text-zinc-400'>Net Payable Amount</p>
            <h1 className='text-2xl font-semibold'>
              {formatAmount(75004.543)}
            </h1>
          </div>
          <div className='flex gap-4 items-center'>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  className='dark:bg-zinc-900 dark:hover:bg-zinc-800/50'
                >
                  Preview
                </Button>
              </DialogTrigger>
              <PreviewModal />
            </Dialog>
            <Button
              onClick={() => {
                toast.error('Database is not available', {
                  position: 'top-center',
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: theme === 'Light' ? 'light' : 'dark'
                })
              }}
              variant='outline'
              className='hover:bg-yellow-600 border-yellow-600 text-yellow-600 hover:text-white bg-transparent border-2'
            >
              Save as draft
            </Button>
            <Button
              variant='default'
              className='bg-emerald-600 text-white hover:bg-emerald-700'
              onClick={() => {
                toast.error('Database is not available', {
                  position: 'top-center',
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: theme === 'Light' ? 'light' : 'dark'
                })
                const invoiceData = {
                  customerInfoState,
                  customerLegalName,
                  invoiceInfoState,
                  itemsInfoState,
                  paymentInfoState
                }
                console.log(invoiceData)
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default createInvoice
