import { Button } from '@/components/ui/button'
import {
  DialogContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, Loader2Icon } from 'lucide-react'
import {
  callErrorToast,
  formatAmount,
  formatDate,
  numTowords
} from '@/lib/helpers'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StatusBadge } from '@/components/status-badge'
import CollapsiblePurchasedItems from './purchased-items'
import { useInvoiceContext } from '@/context/invoice'
import { formatTexttoCaps } from '@/lib/helpers'
import { Organization } from '@prisma/client'
import { OrganizationAddress } from '@/types/organization'
import { Skeleton } from '@/components/ui/skeleton'

const PreviewModal = ({
  isLoadingState,
  onCreateInvoice,
  organizationDetails,
  loading
}: {
  isLoadingState: string | null
  onCreateInvoice: () => {}
  organizationDetails: Organization | undefined
  loading: boolean
}) => {
  // Todo: Will have to revamp the code structure
  const { invoiceInfoState, subTotal, customerInfoState, paymentInfoState } =
    useInvoiceContext()

  const orgsAddress: OrganizationAddress = organizationDetails?.address
    ? JSON.parse(organizationDetails?.address.toString())
    : null

  const fromAddress =
    (organizationDetails?.orgName ? organizationDetails?.orgName : '') +
    (orgsAddress?.state ? ', ' + orgsAddress?.state : '') +
    (orgsAddress?.country ? ', ' + orgsAddress?.country : '')

  const toAddress =
    (customerInfoState?.state ? ', ' + customerInfoState?.state : '') +
    (customerInfoState?.country ? ', ' + customerInfoState?.country : '')

  return (
    <DialogContent className='bg-white dark:bg-zinc-900 dark:border-zinc-700 border-zinc-200 max-w-3xl'>
      <DialogHeader>
        <DialogTitle className='flex items-center justify-between pb-1 pr-6'>
          <p className='font-bold text-3xl'>
            Invoice
            <span className='text-lg font-medium ml-2 dark:text-sky-300 text-sky-600'>
              <span className='dark:text-white/50 text-black/50 mr-1'>#</span>
              {invoiceInfoState.invoiceNumber
                ? 'INV-' + invoiceInfoState.invoiceNumber
                : '-'}
            </span>
          </p>
          <StatusBadge status={formatTexttoCaps(paymentInfoState.status)} />
        </DialogTitle>
        <Tabs defaultValue='digital' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='digital'>Digital</TabsTrigger>
            <TabsTrigger value='paper'>Paper</TabsTrigger>
          </TabsList>
          <TabsContent value='digital'>
            <div className='overflow-y-auto h-80 font-medium px-4'>
              <div className='flex gap-4 items-end text-zinc-800/60 dark:text-zinc-200/60 text-sm mt-2 font-semibold'>
                <span className=''>
                  PAYMENT METHOD :{' '}
                  <span className='ml-1'>
                    {formatTexttoCaps(paymentInfoState.method)}
                  </span>
                </span>
                <p className='w-[1.5px] h-3.5 mb-0.5 bg-zinc-800/40 dark:bg-zinc-200/50'></p>
                <p>
                  DUE ON :{' '}
                  <span className='ml-1'>
                    {formatDate(invoiceInfoState.dueDate)}
                  </span>
                </p>
              </div>
              <Separator className='my-3 bg-black/20 dark:bg-white/20 h-[0.5px]' />
              <div className='flex flex-col gap-3 w-full'>
                <div className='flex text-sm'>
                  <p className='text-zinc-800/60 dark:text-zinc-200/60 w-[10%]'>
                    To
                  </p>
                  <p className='w-[90%]'>{'Test Name' + toAddress}</p>
                </div>
                <div className='flex text-sm'>
                  <p className='text-zinc-800/60 dark:text-zinc-200/60 w-[10%]'>
                    From
                  </p>
                  {loading ? (
                    <Skeleton className='h-5 w-1/2' />
                  ) : (
                    <p className='w-[90%]'>{fromAddress}</p>
                  )}
                </div>
                <div className='flex text-sm'>
                  <p className='text-zinc-800/60 dark:text-zinc-200/60 w-[10%]'>
                    Note
                  </p>
                  <p className='w-[90%]'>{paymentInfoState.notes}</p>
                </div>
              </div>
              <CollapsiblePurchasedItems />
              <Separator className='mt-1 mb-3 bg-black/20 dark:bg-white/20 h-[0.5px]' />
              <div className='w-full flex justify-between mb-3'>
                <div className='w-1/2'>{/* notes */}</div>
                <div className='w-2/6'>
                  <div className='w-full flex justify-between items-center'>
                    <span className='text-zinc-800/60 dark:text-zinc-200/60 text-sm'>
                      Amount Payable
                    </span>
                    <span className='text-xl font-bold'>
                      {formatAmount(
                        subTotal + +paymentInfoState.shippingCharge
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <Alert variant='warning'>
                <Info className='h-4 w-4' />
                <AlertDescription>
                  Your client will get a hosted payment field to make payment
                  with any credit card, debit card, upi and bank transfer
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          <TabsContent value='paper'>
            <div className='overflow-y-auto h-80'>
              <InvoiceFormat
                toAddress={toAddress}
                organizationDetails={organizationDetails}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogHeader>
      <DialogFooter>
        <div className='flex justify-between w-full'>
          <Button
            onClick={() =>
              callErrorToast('This feature is currently unavailable in Beta.')
            }
            variant='ghost'
            className='dark:hover:bg-zinc-800/50 hover:bg-zinc-100 min-w-[150px]'
            disabled={isLoadingState !== null}
          >
            {isLoadingState === 'drafting' ? (
              <Loader2Icon className='animate-spin' />
            ) : (
              'Save as draft'
            )}
          </Button>
          <div className='flex gap-4'>
            <DialogClose asChild>
              <Button
                type='button'
                variant='secondary'
                className='dark:bg-zinc-900 dark:hover:bg-zinc-800/50 dark:border-zinc-700 border-zinc-200 border hover:bg-zinc-100 min-w-[150px]'
              >
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={onCreateInvoice}
              variant='default'
              className='bg-sky-600 text-white hover:bg-sky-700 min-w-[150px]'
              disabled={isLoadingState !== null}
            >
              {isLoadingState === 'sending' ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                'Create' // todo: chnage to send when send functionality is implemented
              )}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

export default PreviewModal

export const IconCard = ({
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
} // Todo: change the location, not used till now

export const InvoiceFormat = ({
  organizationDetails,
  toAddress
}: {
  organizationDetails: Organization | undefined
  toAddress: string
}) => {
  const {
    invoiceInfoState,
    subTotal,
    customerInfoState,
    paymentInfoState,
    itemsInfoState
  } = useInvoiceContext()
  return (
    <div className='border border-black max-w-xl mx-auto min-h-[320px] bg-white text-black py-4 relative'>
      <p className='font-semibold text-[9px] absolute top-1 right-2'>
        ORIGINAL FOR RECIPIENT
      </p>
      <div className='px-4'>
        <div className='flex justify-between items-center'>
          <p className='font-medium text-xl'>{organizationDetails?.orgName}</p>
          <h1 className='text-3xl font-bold'>E</h1>
        </div>
        <div className='flex justify-between items-start'>
          <p className='font-bold text-xs'>
            {invoiceInfoState.invoiceNumber
              ? 'INV-' + invoiceInfoState.invoiceNumber
              : '-'}
          </p>
          <div className='text-right text-[10px]'>
            <p className='font-semibold'>
              Issue Date:{' '}
              <span className='text-black/60'>
                {formatDate(invoiceInfoState.dateIssue)}
              </span>
            </p>
            <p className='font-semibold'>
              Due Date:{' '}
              <span className='text-black/60'>
                {formatDate(invoiceInfoState.dueDate)}
              </span>
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
            <span className='font-normal ml-2'>{'_ ' + toAddress}</span>
          </p>
        </div>
      </div>
      <div className='px-4 my-6 w-full min-h-[100px]'>
        <table className='w-full text-[10px]'>
          <thead>
            <tr>
              <th className='w-[5%] text-black/50'>#</th>
              <th className='w-[70%] text-black/50'>Item</th>
              <th className='w-[10%] text-black/50 text-center'>Qty</th>
              <th className='w-[15%] text-black/50 text-right'>Amount</th>
            </tr>
          </thead>
          <tbody>
            {itemsInfoState.map((item, ind) => {
              return (
                <tr key={item.id}>
                  <td>{ind}</td>
                  <td className='font-semibold'>{item.name || '-'}</td>
                  <td className='text-center'>{item.quantity || 0}</td>
                  <td className='text-right font-semibold'>
                    {formatAmount(item.total)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className='px-4'>
        <Separator className='h-[0.5px] bg-slate-300' />
        <div className='flex justify-end'>
          <div className='w-40 mt-1 px-2'>
            <div className='flex justify-between font-bold text-xs'>
              <h1>Total</h1>
              <h1>{formatAmount(subTotal)}</h1>
            </div>
            <div className='flex justify-between text-[10px] relative'>
              <span className='absolute -left-4 top-1/2 -translate-y-1/2 leading-3 font-bold'>
                +
              </span>
              <h1>Shipping + Tax</h1>
              <h1>{formatAmount(+paymentInfoState.shippingCharge)}</h1>
            </div>
            <div className='flex justify-between text-[10px] relative'>
              <span className='absolute -left-4 top-1/2 -translate-y-1/2 leading-3 font-bold'>
                -
              </span>
              <h1>Discount</h1>
              <h1>{formatAmount(0)}</h1>
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <div className='w-40 flex justify-between font-bold text-sm border-slate-300 mt-1 border-t-[1.5px] px-2'>
            <h1>Sub Total</h1>
            <h1>{formatAmount(subTotal + +paymentInfoState.shippingCharge)}</h1>
          </div>
        </div>
        <p className='text-[8px] text-right'>
          SubTotal (in words) :{' '}
          {numTowords.convert(subTotal + +paymentInfoState.shippingCharge, {
            currency: true
          })}
        </p>
        <Separator className='h-[0.5px] bg-slate-300' />
        <p className='text-xs font-semibold text-right'>
          Amount Payable{' '}
          <span className='ml-6'>
            {formatAmount(subTotal + +paymentInfoState.shippingCharge)}
          </span>
        </p>
        <div className='mt-6 flex justify-between'>
          <div className='text-[10px] w-28'>
            <p className='font-medium leading-3'>
              Notes:{' '}
              <span className='font-light text-[9px] leading-3'>
                {paymentInfoState.notes}
              </span>
            </p>
          </div>
          <div className='w-28 h-28 rounded-full border-[1.5px] border-black p-1'>
            <div className='rounded-full border-[1px] border-black border-dashed h-full flex justify-center items-center'>
              <h1 className='text-xl font-bold -rotate-12'>
                {paymentInfoState.status.toLocaleUpperCase()}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
