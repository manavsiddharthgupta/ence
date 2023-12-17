'use client'
import {
  AlertCircleIcon,
  ArrowDownRightFromCircleIcon,
  ArrowUpRightFromCircleIcon
} from 'lucide-react'
import Tip from '@/components/component-tip'
import { useEffect, useState } from 'react'
import { InvoicesOverview } from '@/types/invoice'
import { Skeleton } from '@/components/ui/skeleton'

const Overview = () => {
  const [invoiceOverview, setOverview] = useState<InvoicesOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInvoiceOverview = async () => {
      setLoading(true)
      const response = await fetch('/api/invoice/overview')
      const overviewRes = await response.json()
      if (!overviewRes.ok) {
        setOverview(null)
        setLoading(false)
        return
      }
      setOverview(overviewRes.data)
      setLoading(false)
    }
    getInvoiceOverview()
  }, [])
  return (
    <div className='my-6 w-full border-[1.5px] dark:border-zinc-700/60 border-zinc-300/60 rounded-lg bg-zinc-300/20 dark:bg-zinc-600/5 backdrop-blur-xl py-6 flex justify-between'>
      <InvoiceOverviewCard
        invoiceOverview={invoiceOverview}
        loading={loading}
      />
    </div>
  )
}
export default Overview

const InvoiceOverviewCard = ({
  invoiceOverview,
  loading
}: {
  invoiceOverview: InvoicesOverview | null
  loading: boolean
}) => {
  return (
    <>
      <InvoiceTypeOverview
        count={invoiceOverview?.totalCountAllTime.paid}
        extraCount={invoiceOverview?.totalCountCurrentWeek.paid}
        rate={invoiceOverview?.percentageChange.paid}
        loading={loading}
        type='Paid'
      />
      <InvoiceTypeOverview
        count={invoiceOverview?.totalCountAllTime.overdue}
        extraCount={invoiceOverview?.totalCountCurrentWeek.overdue}
        rate={invoiceOverview?.percentageChange.overdue}
        loading={loading}
        type='Overdue'
      />
      <InvoiceTypeOverview
        count={invoiceOverview?.totalCountAllTime.due}
        extraCount={invoiceOverview?.totalCountCurrentWeek.due}
        rate={invoiceOverview?.percentageChange.due}
        loading={loading}
        type='Due'
      />
      <InvoiceTypeOverview
        count={invoiceOverview?.totalCountAllTime.partiallyPaid}
        extraCount={invoiceOverview?.totalCountCurrentWeek.partiallyPaid}
        rate={invoiceOverview?.percentageChange.partiallyPaid}
        loading={loading}
        type='Partially Paid'
        isLast={true}
      />
    </>
  )
}

const InvoiceTypeOverview = ({
  type,
  count,
  extraCount,
  rate,
  isLast = false,
  loading
}: {
  type: string
  rate: number | null | undefined
  count: number | null | undefined
  extraCount: number | null | undefined
  isLast?: Boolean
  loading: boolean
}) => {
  return (
    <div
      className={
        isLast === false
          ? 'border-r-2 border-zinc-300 dark:border-zinc-700 w-[24%] pl-8'
          : 'w-[24%] pl-8'
      }
    >
      {loading ? (
        <Skeleton className='h-3 w-14 bg-gray-500/10' />
      ) : (
        <p className='text-xs text-zinc-700 dark:text-zinc-400 font-medium'>
          {type} ({extraCount || '-'})
        </p>
      )}

      {loading ? (
        <Skeleton className='h-6 w-6 mb-1 mt-2 bg-gray-500/10' />
      ) : (
        <h1 className='text-2xl font-bold pl-1'>{count || '-'}</h1>
      )}
      <div className='flex gap-1 items-center'>
        <span className='text-[10px] dark:text-zinc-400/70 text-zinc-700/70'>
          vs last week
        </span>
        {loading ? (
          <Skeleton className='h-4 w-8 bg-gray-500/10' />
        ) : (
          <span className='text-xs font-semibold'>{rate || '0.0'}%</span>
        )}
        {rate === null || rate === undefined || rate === 0 ? (
          <Tip info='Data not available'>
            <AlertCircleIcon
              size='12px'
              className='text-black/30 dark:text-white/20'
              strokeWidth='3px'
            />
          </Tip>
        ) : rate > 0 ? (
          <ArrowUpRightFromCircleIcon
            size='12px'
            color='green'
            strokeWidth='3px'
          />
        ) : (
          <ArrowDownRightFromCircleIcon
            size='12px'
            color='red'
            strokeWidth='3px'
          />
        )}
      </div>
    </div>
  )
}
