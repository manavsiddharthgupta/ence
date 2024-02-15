import {
  AlertCircleIcon,
  ArrowDownRightFromCircleIcon,
  ArrowUpRightFromCircleIcon
} from 'lucide-react'
import Tip from '@/components/component-tip'
import { InvoicesOverview } from '@/types/invoice'
const Overview = ({
  overview: invoiceOverview
}: {
  overview: InvoicesOverview | null
}) => {
  return (
    <div className='mt-6 mb-12 w-full border-[1px] dark:border-zinc-700/60 border-zinc-300/60 rounded-2xl bg-zinc-100/20 dark:bg-zinc-800/10 py-6 flex justify-between'>
      <InvoiceOverviewCard invoiceOverview={invoiceOverview} />
    </div>
  )
}
export default Overview

const InvoiceOverviewCard = ({
  invoiceOverview
}: {
  invoiceOverview: InvoicesOverview | null
}) => {
  return (
    <>
      <InvoiceTypeOverview
        count={invoiceOverview?.totalCountAllTime.paid}
        extraCount={invoiceOverview?.totalCountCurrentWeek.paid}
        rate={invoiceOverview?.percentageChange.paid}
        type='Paid'
      />
      <InvoiceTypeOverview
        count={invoiceOverview?.totalCountAllTime.overdue}
        extraCount={invoiceOverview?.totalCountCurrentWeek.overdue}
        rate={invoiceOverview?.percentageChange.overdue}
        type='Overdue'
      />
      <InvoiceTypeOverview
        count={invoiceOverview?.totalCountAllTime.due}
        extraCount={invoiceOverview?.totalCountCurrentWeek.due}
        rate={invoiceOverview?.percentageChange.due}
        type='Due'
      />
      <InvoiceTypeOverview
        count={invoiceOverview?.totalCountAllTime.partiallyPaid}
        extraCount={invoiceOverview?.totalCountCurrentWeek.partiallyPaid}
        rate={invoiceOverview?.percentageChange.partiallyPaid}
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
  isLast = false
}: {
  type: string
  rate: number | null | undefined
  count: number | null | undefined
  extraCount: number | null | undefined
  isLast?: Boolean
}) => {
  return (
    <div
      className={
        isLast === false
          ? 'border-r-2 border-zinc-200/60 dark:border-zinc-700/60 w-[24%] pl-8'
          : 'w-[24%] pl-8'
      }
    >
      <p className='text-xs text-zinc-700 dark:text-zinc-400 font-medium'>
        {type} ({extraCount || '-'})
      </p>
      <h1 className='text-2xl font-bold pl-1'>{count || '-'}</h1>
      <div className='flex gap-1 items-center'>
        <span className='text-[10px] dark:text-zinc-400/70 text-zinc-700/70'>
          vs week
        </span>
        <span className='text-xs font-semibold'>{rate || '0.0'}%</span>
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
