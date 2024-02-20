'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, InfoIcon, Loader2, ReceiptText } from 'lucide-react'
import { notFound, useSearchParams } from 'next/navigation'
import { formatAmount, formatDate } from 'helper/format'
import { useEffect, useState } from 'react'

const baseURI = process.env.NEXT_PUBLIC_API_URL

const InvoiceApproval = () => {
  const [invoiceImageUrl, setImageUrl] = useState<string | null>()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const status = searchParams.get('status')
  if (!token) {
    return notFound()
  }
  const {
    isPending,
    error,
    data: res
  } = useQuery({
    queryKey: ['customer-approval'],
    queryFn: () =>
      fetch(`${baseURI}/api/magiclinks/invoice?token=${token}`).then((res) =>
        res.json()
      )
  })

  useEffect(() => {
    const invoiceImage = res?.data?.id
      ? baseURI + `/api/invoice/${res?.data?.id}/og`
      : null
    if (!invoiceImage) {
      return
    }
    const onFetchImage = async () => {
      const response = await fetch(invoiceImage)
      const blobImage = await response.blob()
      const href = URL.createObjectURL(blobImage)
      setImageUrl(href)
    }
    onFetchImage()
  }, [res])

  if (isPending) {
    return status === 'approve' ? (
      <div className='flex gap-2 items-center'>
        <Loader2 className='animate-spin' />
        <p className='font-medium'>Approving Invoice</p>
      </div>
    ) : status === 'reject' ? (
      <div className='flex gap-2 items-center'>
        <Loader2 className='animate-spin' />
        <p className='font-medium'>Rejecting Invoice</p>
      </div>
    ) : (
      <div className='flex gap-2 items-center'>
        <Loader2 className='animate-spin' />
        <p className='font-medium'>Updating Invoice</p>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorCard
        title='Something went wrong :('
        description={error?.message || 'Please try again later.'}
      />
    )
  }

  if (!res?.ok) {
    return (
      <ErrorCard
        title='Something went wrong :('
        description={res?.data + ' Please try again later.'}
      />
    )
  }
  const data = res?.data

  return (
    <div className='bg-white shadow-lg rounded-2xl p-6 w-full max-w-96 text-black'>
      <p className='text-xs font-medium'>
        Invoice from {data?.organization?.orgName || '-'}
      </p>
      <div className='flex justify-between items-center mt-4'>
        <div>
          <h1 className='font-bold text-4xl leading-9'>
            {formatAmount(data?.totalAmount || 0)}
          </h1>
          <p className='text-[10px] mt-1 font-semibold text-black/50'>
            Due Date: {formatDate(data?.dueDate)}
          </p>
        </div>
        <ReceiptText size={46} strokeWidth={2.5} color='#00000021' />
      </div>
      <div className='min-h-32 h-fit max-h-60 overflow-y-auto'>
        <table className='min-w-full my-4'>
          <colgroup>
            <col className='w-1/2' />
            <col className='w-1/4' />
            <col className='w-1/4' />
          </colgroup>
          <thead className='border-b border-gray-300 text-gray-900 text-xs'>
            <tr>
              <th
                scope='col'
                className='py-1.5 text-left font-semibold text-gray-900'
              >
                Items
              </th>
              <th
                scope='col'
                className='py-1.5 text-center font-semibold text-gray-900'
              >
                Quantity
              </th>
              <th
                scope='col'
                className='py-1.5 text-right font-semibold text-gray-900'
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data?.items) &&
              data?.items.map((item: any) => {
                return (
                  <tr
                    key={item?.id}
                    className='border-b text-xs border-gray-200'
                  >
                    <td className='max-w-0 py-2'>
                      <div className='font-medium text-gray-900'>
                        {item?.name || '-'}
                      </div>
                    </td>
                    <td className='py-2 text-center text-gray-500'>
                      {item?.quantity || '-'}
                    </td>
                    <td className='py-2 text-right text-gray-500'>
                      {formatAmount(item?.price || 0)}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        {!Array.isArray(data?.items) && (
          <p className='text-xs text-center'>No Items</p>
        )}
      </div>
      <Alert variant='default'>
        <InfoIcon size={16} />
        <AlertTitle className='text-sm font-medium'>
          {data?.approvalStatus || 'Heads up'!}
        </AlertTitle>
        <AlertDescription className='text-xs'>
          You have {data?.fresh ? ' ' : 'already '}
          {data?.approvalStatus ? data?.approvalStatus.toLowerCase() : '-'} the
          Invoice.
        </AlertDescription>
      </Alert>
      {invoiceImageUrl && (
        <p className='text-xs text-center mt-2'>
          <a
            className='underline'
            href={invoiceImageUrl}
            download={`INV-${data?.invoiceNumber}.webp`}
          >
            Download invoice here
          </a>
        </p>
      )}
    </div>
  )
}

export default InvoiceApproval

const ErrorCard = ({
  title,
  description
}: {
  title: string
  description: string
}) => {
  return (
    <div className='w-fit bg-white min-w-[320px]'>
      <Alert variant='destructive'>
        <AlertTriangle size={18} />
        <AlertTitle className='text-sm'>{title}</AlertTitle>
        <AlertDescription className='text-xs'>{description}</AlertDescription>
      </Alert>
    </div>
  )
}
