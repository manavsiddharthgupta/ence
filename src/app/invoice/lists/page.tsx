'use client'
import {
  ArrowDownRightFromCircleIcon,
  ArrowUpRightFromCircleIcon
} from 'lucide-react'
import InvoiceTable from './invoices-table'
import { DatePickerWithRange } from '@/components/ui/datepicker-with-range'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { addDays } from 'date-fns'
import { Input } from '@/components/ui/input'

const Lists = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20)
  })
  // will have to revamp code
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <p className='text-xs leading-3 text-zinc-600/80 dark:text-zinc-300/80 font-medium'>
        Overview
      </p>
      <h1 className='text-4xl leading-9 font-semibold'>Invoice Lists</h1>
      <div className='my-6 w-full border-[1.5px] dark:border-zinc-700/60 border-zinc-300/60 rounded-lg bg-zinc-300/20 dark:bg-zinc-600/5 backdrop-blur-xl py-6 px-8 flex justify-between'>
        <InvoiceTypeOverview
          count={5}
          extraCount={1}
          isIncreased={false}
          rate={-2.4}
          type='Paid'
        />
        <InvoiceTypeOverview
          count={2}
          extraCount={4}
          isIncreased={true}
          rate={1.4}
          type='Unpaid'
        />
        <InvoiceTypeOverview
          count={1}
          extraCount={3}
          isIncreased={true}
          rate={7.8}
          type='Pending'
        />
        <InvoiceTypeOverview
          count={3}
          extraCount={1}
          isIncreased={false}
          rate={-1.2}
          type='Partially Paid'
          isLast={true}
        />
      </div>
      <div className='my-8'>
        <div className='flex justify-between items-end mb-2'>
          <Input
            placeholder='Filter Invoices ...'
            type='text'
            className='h-9 max-w-xs bg-zinc-300/20 dark:bg-zinc-600/5 dark:border-zinc-700 border-zinc-200'
          />
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
        <InvoiceCard>
          <InvoiceTable />
        </InvoiceCard>
      </div>
    </div>
  )
}

export default Lists

const InvoiceTypeOverview = ({
  type,
  count,
  extraCount,
  rate,
  isIncreased,
  isLast = false
}: {
  type: string
  rate: number
  count: number
  extraCount: number
  isIncreased: Boolean
  isLast?: Boolean
}) => {
  return (
    <div
      className={
        isLast === false
          ? 'border-r-2 border-zinc-300 dark:border-zinc-700 pr-20'
          : 'pr-12'
      }
    >
      <p className='text-xs text-zinc-700 dark:text-zinc-400 font-medium'>
        {type} ({extraCount})
      </p>
      <h1 className='text-2xl font-bold pl-1'>{count}</h1>
      <div className='flex gap-1 items-center'>
        <span className='text-[10px] dark:text-zinc-400/70 text-zinc-700/70'>
          vs last week
        </span>
        <span className='text-xs font-semibold'>{rate}%</span>
        {isIncreased === true ? (
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

const InvoiceCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='dark:bg-zinc-600/5 bg-zinc-300/20 border-[1.5px] dark:border-zinc-700/60 border-zinc-300/60 px-4 py-2 rounded-lg'>
      {children}
    </div>
  )
}
