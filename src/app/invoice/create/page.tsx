'use client'
import { Separator } from '@/components/ui/separator'
import CustomerInfo from './customerInfo'
import BusinessInfo from './businessInfo'
import PaymentDetails from './paymentDetails'
import InvoiceInfo from './invoiceInfo'
import ItemsInfo from './itemsInfo'
import {
  callErrorToast,
  callLoadingToast,
  dismissToast,
  formatAmount,
  formatInvoiceData
} from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { useInvoiceContext } from '@/context/invoice'
import PreviewModal from './preview-modal'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2Icon } from 'lucide-react'
import { Organization } from '@prisma/client'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'react-toastify'

const createInvoice = () => {
  const [isLoading, setLoading] = useState<string | null>(null)
  const [organizationDetails, setOrganizationDetails] = useState<Organization>()
  const [loadingOrganization, setLoadingOrganization] = useState(false)
  const {
    customerInfoState,
    customerLegalName,
    invoiceInfoState,
    itemsInfoState,
    paymentInfoState,
    subTotal,
    setSubTotal
  } = useInvoiceContext()
  const router = useRouter()

  useEffect(() => {
    const getOrgDetails = async () => {
      setLoadingOrganization(true)
      const response = await fetch('/api/organization')
      const organizationRes = await response.json()
      if (!organizationRes.ok) {
        setOrganizationDetails(undefined)
        setLoadingOrganization(false)
        return
      }
      setOrganizationDetails(organizationRes.data)
      setLoadingOrganization(false)
    }
    getOrgDetails()
  }, [])

  useEffect(() => {
    const sum = itemsInfoState.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.total
    }, 0)
    setSubTotal(sum)
  }, [itemsInfoState])

  const onCreateInvoice = async () => {
    const customerCommunicationValid =
      invoiceInfoState.sendingMethod === 'whatsapp'
        ? customerInfoState.whatsappNumber
        : customerInfoState.email
    if (!invoiceInfoState.invoiceNumber && !customerCommunicationValid) {
      callErrorToast(
        'Please provide invoice number and customer ' +
          invoiceInfoState.sendingMethod
      )
      return
    } else if (!invoiceInfoState.invoiceNumber) {
      callErrorToast('Please provide invoice number')
      return
    } else if (!customerCommunicationValid) {
      callErrorToast(
        'Please provide customer ' + invoiceInfoState.sendingMethod
      )
      return
    }
    const formattedData = formatInvoiceData(
      customerInfoState,
      customerLegalName,
      invoiceInfoState,
      paymentInfoState,
      itemsInfoState,
      subTotal
    )
    // saving invoice Details
    setLoading('sending')
    const loadingToastId = callLoadingToast('Creating invoice...')
    const response = await fetch('/api/invoice', {
      method: 'POST',
      body: JSON.stringify(formattedData)
    })
    const invRes = await response.json()
    dismissToast(loadingToastId)
    if (invRes.ok) {
      toast.update(loadingToastId, {
        render: 'Invoice created successfully!',
        type: 'success',
        isLoading: false
      })
      router.push('/invoice/lists')
    } else {
      setLoading(null)
      toast.update(loadingToastId, {
        render: 'Database is not available',
        type: 'success',
        isLoading: false
      })
    }
  }
  let organizationName = loadingOrganization ? (
    <Skeleton className='rounded-md h-12 w-full bg-gray-500/10' />
  ) : (
    <>
      <h2 className='text-3xl font-medium'>
        {organizationDetails?.orgName || '-'}
      </h2>
      <h1 className='text-5xl font-bold'>E</h1>
    </>
  )

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
          {organizationName}
        </div>
        <Separator className='my-4 dark:bg-zinc-700 bg-zinc-300' />
        <div className='flex justify-between'>
          <div className='w-[45%]'>
            <BusinessInfo
              organizationDetails={organizationDetails}
              loading={loadingOrganization}
            />
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
              {formatAmount(subTotal + +paymentInfoState.adjustmentFee)}
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
              <PreviewModal
                onCreateInvoice={onCreateInvoice}
                isLoadingState={isLoading}
                organizationDetails={organizationDetails}
                loading={loadingOrganization}
              />
            </Dialog>
            <Button
              onClick={() => {
                callErrorToast('This feature is currently unavailable in Beta.')
                // save as draft logic
              }}
              variant='outline'
              className='hover:bg-yellow-600 border-yellow-600 text-yellow-600 hover:text-white bg-transparent border-2 min-w-[150px]'
              disabled={isLoading !== null}
            >
              {isLoading === 'drafting' ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                'Save as draft'
              )}
            </Button>
            <Button
              variant='default'
              className='bg-sky-600 text-white hover:bg-sky-700 min-w-[150px]'
              disabled={isLoading !== null}
              onClick={onCreateInvoice}
            >
              {isLoading === 'sending' ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                'Create' // todo: chnage to send when send functionality is implemented
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default createInvoice
