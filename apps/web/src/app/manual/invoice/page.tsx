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
  formatInvoiceData
} from '@/lib/helpers'
import { formatAmount } from 'helper/format'
import { Button } from '@/components/ui/button'
import { useInvoiceContext } from '@/context/invoice'
import PreviewModal from './preview-modal'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2Icon } from 'lucide-react'
import { Organization } from 'database'
import { toast } from 'sonner'
import BackBtn from '@/components/back-btn'
import { Sheet } from '@/components/ui/sheet'

const createInvoice = () => {
  const [isLoading, setLoading] = useState<string | null>(null)
  const [organizationDetails, setOrganizationDetails] = useState<Organization>()
  const [loadingOrganization, setLoadingOrganization] = useState(false)
  const {
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
        ? customerLegalName?.whatsAppNumber
        : customerLegalName?.email

    console.log(customerCommunicationValid, customerLegalName?.id)
    if (
      !invoiceInfoState.invoiceNumber ||
      !customerCommunicationValid ||
      !customerLegalName?.id
    ) {
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
      customerLegalName.id,
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
    if (invRes.ok) {
      toast.success('🎉 Invoice created successfully!', {
        id: loadingToastId
      })
      router.push('/invoice/lists')
    } else {
      setLoading(null)
      toast.error('Something went wrong while creating invoice', {
        id: loadingToastId
      })
    }
  }

  const separatorStyle = 'my-6 h-[0.5px] dark:bg-zinc-700 bg-zinc-300'
  return (
    <Sheet>
      <div className='relative w-full'>
        <div className='max-w-4xl w-full mx-auto pb-8'>
          <div className='mb-6'>
            <BackBtn />
            <h1 className='mt-2 text-2xl font-semibold'>New Invoice</h1>
            <p className='text-xs font-medium mt-2'>
              Fill in the fields, preview invoice and send it emailed or
              whatsapp directly to client.
            </p>
          </div>
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
        <div className='fixed w-full bottom-0 left-0 dark:bg-zinc-900 bg-white z-40'>
          <Separator className='h-0.5 dark:bg-zinc-800/90 bg-zinc-200/90' />
          <div className='flex items-center justify-between max-w-4xl w-full mx-auto py-4'>
            <div>
              <p className='text-xs text-zinc-400'>Net Payable Amount</p>
              <h1 className='text-2xl font-semibold'>
                {formatAmount(
                  subTotal +
                    +paymentInfoState.adjustmentFee +
                    +paymentInfoState.additionalCharges
                )}
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
                variant='default'
                className='bg-sky-600 text-white hover:bg-sky-700 min-w-[150px]'
                disabled={isLoading !== null}
                onClick={onCreateInvoice}
              >
                {isLoading === 'sending' ? (
                  <Loader2Icon className='animate-spin' />
                ) : (
                  'Save & Send' // todo: chnage to send when send functionality is implemented
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  )
}

export default createInvoice
