import Tip from '@/components/component-tip'
import AuditTrail from '@/components/invoice/audit-trail'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatAmount, formatDate } from 'helper/format'
import { InvoiceBody } from '@/types/invoice'
import {
  Banknote,
  Bell,
  Calendar,
  CheckCircle,
  Info,
  UserCircleIcon
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

const baseurl = process.env.NEXT_PUBLIC_API_URL

const Invoice = ({ invoiceId }: { invoiceId: string | null }) => {
  const {
    isPending,
    error,
    data: invoiceInfo
  } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      const response = await fetch(`${baseurl}/api/invoice/${invoiceId}`)
      const responseData = await response.json()
      const invoiceData: InvoiceBody = responseData.data
      return invoiceData
    }
  })

  if (error) {
    return (
      <SheetContent className='w-full sm:max-w-5xl flex items-center justify-center'>
        <p className='text-xs text-red-500 font-semibold'>
          something went wrong :(
        </p>
      </SheetContent>
    )
  }

  if (!invoiceInfo && !isPending) {
    return (
      <SheetContent className='w-full sm:max-w-5xl flex items-center justify-center'>
        <p className='text-xs text-red-500 font-semibold'>
          something went wrong :(
        </p>
      </SheetContent>
    )
  }

  const formatTextToCamelCase = (text: string, type?: string) => {
    if (!text) {
      return null
    }
    const firstChar = text[0]?.toUpperCase()
    const splittedText = text?.slice(1).toLowerCase()
    if (type === 'payment-status') {
      return firstChar + splittedText
    }
    return firstChar + splittedText
  }

  const formatCustomerName = (text: string | undefined) => {
    if (!text) {
      return '-'
    }
    if (text.length < 15) {
      return text
    }
    return text.slice(0, 15) + '...'
  }

  const customerInfo = invoiceInfo?.customerInfo?.legalName

  const invoiceDetail = invoiceInfo
    ? {
        invoiceNumber: `INV-${invoiceInfo?.invoiceNumber}`,
        issueDate: formatDate(invoiceInfo.dateIssue),
        dueDate: formatDate(invoiceInfo.dueDate),
        paymentStatus: formatTextToCamelCase(invoiceInfo.paymentStatus),
        customer: formatCustomerName(customerInfo),
        auditTrail: invoiceInfo.auditTrailEntries,
        paymentTerm: formatTextToCamelCase(invoiceInfo.paymentTerms),
        paymentMethod: formatTextToCamelCase(invoiceInfo.paymentMethod),
        adjustmentFee: invoiceInfo?.adjustmentFee,
        invoiceTotal: invoiceInfo?.invoiceTotal,
        approvalStatus: invoiceInfo?.approvalStatus,
        shippingCharges: invoiceInfo.shippingCharge,
        packagingCharges: invoiceInfo.packagingCharge,
        amtToConsumer: invoiceInfo?.totalAmount,
        paidAmount: invoiceInfo.totalAmount - invoiceInfo.dueAmount,
        amountPayable: invoiceInfo.dueAmount,
        invoiceLinks: invoiceInfo.relatedDocuments
      }
    : null

  const filteredInvoiceLink =
    invoiceDetail?.invoiceLinks && invoiceDetail?.invoiceLinks?.length > 0
      ? invoiceDetail?.invoiceLinks?.filter((doc) => {
          return doc.name === 'MAIN_IMAGE'
        })
      : []

  const invoiceImage =
    filteredInvoiceLink.length > 0 ? filteredInvoiceLink[0].documentLink : null

  return (
    <SheetContent className='w-full sm:max-w-5xl'>
      <div className='w-full flex justify-between h-full'>
        <div className='w-1/2 overflow-y-auto h-full'>
          <SheetHeader>
            <SheetTitle className='w-full'>
              {isPending ? (
                <Skeleton className='h-7 bg-gray-500/10' />
              ) : (
                <div className='flex justify-between items-center'>
                  <div className='flex items-end gap-1.5'>
                    <p className='text-xl font-medium'>Invoice info</p>
                    <div className='flex gap-2 items-center'>
                      <span className='text-base font-bold'>
                        #{invoiceDetail?.invoiceNumber || '-'}
                      </span>
                      {invoiceDetail?.approvalStatus === 'APPROVED' && (
                        <Tip info='Invoice is approved by customer'>
                          <CheckCircle size={17} className='text-green-500' />
                        </Tip>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={invoiceDetail?.paymentStatus || '-'} />
                </div>
              )}
            </SheetTitle>
            <Separator className='my-6 h-[0.5px] dark:bg-zinc-700 bg-zinc-300' />
          </SheetHeader>
          <div className='mt-4 mb-8 grid justify-between grid-cols-3 gap-y-8 gap-x-2'>
            <InvoiceField
              fieldName='Invoice Number'
              fieldValue={invoiceDetail?.invoiceNumber || '-'}
              loading={isPending}
            />
            <InvoiceField
              fieldName='Issue Date'
              fieldValue={invoiceDetail?.issueDate || '-'}
              type='date'
              loading={isPending}
            />
            <InvoiceField
              fieldName='Customer'
              fieldValue={invoiceDetail?.customer || '-'}
              type='user'
              loading={isPending}
            />
            <InvoiceField
              fieldName='Payment Term'
              fieldValue={invoiceDetail?.paymentTerm || '-'}
              loading={isPending}
            />
            <InvoiceField
              fieldName='Due Date'
              fieldValue={invoiceDetail?.dueDate || '-'}
              type='date'
              loading={isPending}
            />
            <InvoiceField
              fieldName='Status'
              fieldValue={invoiceDetail?.paymentStatus || '-'}
              loading={isPending}
            />
            <InvoiceField
              fieldName='Payment Method'
              fieldValue={invoiceDetail?.paymentMethod || '-'}
              loading={isPending}
            />
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex gap-2 items-center'>
              <Banknote size={26} className='text-green-500' />
              <h3 className='font-semibold dark:text-zinc-50/50 text-zinc-900/60'>
                Payable Amount
              </h3>
              {isPending ? (
                <Skeleton className='w-28 h-7 bg-gray-500/10' />
              ) : (
                <span className='font-bold text-xl text-black dark:text-white'>
                  {formatAmount(invoiceInfo?.dueAmount || 0)}
                </span>
              )}
            </div>
            {isPending ? (
              <Skeleton className='w-1/2 h-9 bg-gray-500/10' />
            ) : (
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  disabled
                  className='text-xs items-center gap-2 px-6 h-9 dark:bg-transparent dark:hover:bg-zinc-800/50 dark:border-zinc-600/30 border-zinc-400/30'
                >
                  <Bell size={12} />
                  <p>Send Payment Reminder</p>
                  <Badge className='text-[10px] leading-[14px] px-2'>
                    {invoiceDetail?.paymentMethod || '-'}
                  </Badge>
                </Button>
              </div>
            )}
          </div>
          <div className='my-8'>
            <h3 className='font-medium'>Amount Details</h3>
            <div className='pt-4 flex flex-col gap-2.5'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2 text-zinc-900/60 dark:text-white/50'>
                  <h3 className='text-xs font-medium'>Invoice Total</h3>
                  <Tip info='Subtotal - Discount ± Adjustment'>
                    <Info size={10} strokeWidth={2.5} className='mt-0.5' />
                  </Tip>
                </div>
                {isPending ? (
                  <AmountInfoSkeleton />
                ) : (
                  <h2 className='text-lg font-bold'>
                    {formatAmount(invoiceDetail?.invoiceTotal || 0)}
                  </h2>
                )}
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2 text-zinc-900/60 dark:text-white/50'>
                  <h3 className='text-xs font-medium'>Additional Charges</h3>
                  <Tip info='Packaging Charge + Shipping Charge'>
                    <Info size={10} strokeWidth={2.5} className='mt-0.5' />
                  </Tip>
                </div>
                {isPending ? (
                  <AmountInfoSkeleton />
                ) : (
                  <h2 className='text-lg font-bold'>
                    {formatAmount(
                      (invoiceDetail?.shippingCharges || 0) +
                        (invoiceDetail?.packagingCharges || 0)
                    )}
                  </h2>
                )}
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2 text-zinc-900/60 dark:text-white/50'>
                  <h3 className='text-xs font-medium'>Amount to Consumer</h3>
                  <Tip info='Invoice Total + Shipping Charge'>
                    <Info size={10} strokeWidth={2.5} className='mt-0.5' />
                  </Tip>
                </div>
                {isPending ? (
                  <AmountInfoSkeleton />
                ) : (
                  <h2 className='text-lg font-bold'>
                    {formatAmount(invoiceDetail?.amtToConsumer || 0)}
                  </h2>
                )}
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2 text-zinc-900/60 dark:text-white/50'>
                  <h3 className='text-xs font-medium'>Amount Paid</h3>
                  <Tip info='Amount that is already paid by consumer'>
                    <Info size={10} strokeWidth={2.5} className='mt-0.5' />
                  </Tip>
                </div>
                {isPending ? (
                  <AmountInfoSkeleton />
                ) : (
                  <h2 className='text-lg font-bold'>
                    {formatAmount(invoiceDetail?.paidAmount || 0)}
                  </h2>
                )}
              </div>
              <Separator className='h-[0.5px] dark:bg-zinc-700 bg-zinc-300' />
              <div className='flex justify-between'>
                <div className='flex items-center gap-2 text-zinc-900/60 dark:text-white/50'>
                  <h3 className='text-xs font-medium'>Amount Payable</h3>
                  <Tip info='Amount to consumer - Amount paid'>
                    <Info size={10} strokeWidth={2.5} className='mt-0.5' />
                  </Tip>
                </div>
                {isPending ? (
                  <AmountInfoSkeleton />
                ) : (
                  <h2 className='text-lg font-bold'>
                    {formatAmount(invoiceDetail?.amountPayable || 0)}
                  </h2>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='w-[45%] h-full'>
          <SheetHeader>
            <SheetTitle className='text-lg'>Preview</SheetTitle>
          </SheetHeader>
          <Separator className='h-[0.5px] mt-2 mb-3 dark:bg-zinc-700 bg-zinc-300' />
          <Tabs defaultValue='audit' className='w-full h-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='audit'>Audit Trail</TabsTrigger>
            </TabsList>
            <TabsContent
              value='overview'
              className='h-[calc(100%-82px)] overflow-scroll'
            >
              <div>
                {invoiceImage !== null ? (
                  <Image
                    src={invoiceImage}
                    alt='invoice'
                    width='0'
                    height='0'
                    sizes='100vw'
                    style={{ width: '100%', height: 'auto' }}
                  />
                ) : (
                  <p className='text-xs text-center font-medium my-16'>
                    It may take sometime...
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent
              value='audit'
              className='h-[calc(100%-82px)] overflow-scroll'
            >
              {isPending ? (
                <p className='text-xs text-center font-medium'>Loading...</p>
              ) : (
                <AuditTrail auditTrail={invoiceDetail?.auditTrail} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SheetContent>
  )
}

export default Invoice

const InvoiceField = ({
  fieldName,
  fieldValue,
  type,
  loading
}: {
  fieldName: string
  fieldValue: string
  type?: 'default' | 'date' | 'user'
  loading: boolean
}) => {
  if (type === 'date') {
    return (
      <div className='flex flex-col gap-1 font-semibold text-xs w-fit'>
        <p className='dark:text-zinc-50/50 text-zinc-900/60'>{fieldName}</p>
        <div className='flex items-center gap-2'>
          <Calendar size={14} color='#8f8f8f' />
          {loading ? <InvoiceInfoSkeleton /> : <p className=''>{fieldValue}</p>}
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
          {loading ? <InvoiceInfoSkeleton /> : <p className=''>{fieldValue}</p>}
        </div>
      </div>
    )
  }
  return (
    <div className='flex flex-col gap-1 font-semibold text-xs w-fit'>
      <p className='dark:text-zinc-50/50 text-zinc-900/60'>{fieldName}</p>
      {loading ? <InvoiceInfoSkeleton /> : <p className=''>{fieldValue}</p>}
    </div>
  )
}

const InvoiceInfoSkeleton = () => {
  return <Skeleton className='rounded-md h-4 w-20 bg-gray-500/10' />
}

const AmountInfoSkeleton = () => {
  return <Skeleton className='rounded-md h-7 w-40 bg-gray-500/10' />
}
