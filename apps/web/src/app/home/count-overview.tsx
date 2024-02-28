'use client'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { formatAmount } from 'helper/format'
import { Banknote, Coins, TrendingUp, Wallet2 } from 'lucide-react'
import { notFound } from 'next/navigation'

const baseurl = process.env.NEXT_PUBLIC_API_URL

const CountOverview = () => {
  const {
    isPending,
    error,
    data: countOverview
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: () =>
      fetch(`${baseurl}/api/invoice/analytics/counts`).then((res) => res.json())
  })

  if (isPending) {
    return <CountOverviewSuspense />
  }

  if (error || !countOverview.ok) {
    notFound()
  }
  return (
    <div className='py-6 flex gap-4'>
      <OverviewCard
        name='SALES'
        amount={countOverview.data.all.sum}
        color='bg-sky-500/10 text-sky-500'
        count={countOverview.data.all.count}
        icon={<TrendingUp size={18} strokeWidth={1.5} />}
      />
      <OverviewCard
        name='PAID'
        amount={countOverview.data.paid.sum}
        color='bg-green-500/10 text-green-500'
        count={countOverview.data.paid.count}
        icon={<Banknote size={18} strokeWidth={1.5} />}
      />
      <OverviewCard
        name='UNPAID'
        amount={countOverview.data.unpaid.sum}
        color='bg-red-500/10 text-red-500'
        count={countOverview.data.unpaid.count}
        icon={<Coins size={18} strokeWidth={1.5} />}
      />
      <OverviewCard
        name='EXPENSE'
        amount={0}
        color='bg-yellow-500/10 text-yellow-500'
        count={0}
        type='Expense'
        icon={<Wallet2 size={18} strokeWidth={1.5} />}
      />
    </div>
  )
}

export default CountOverview

const OverviewCard = ({
  name,
  amount,
  count,
  color,
  icon,
  type = 'Invoice'
}: {
  name: string
  amount: number | null
  count: number | null
  color: string
  icon: React.ReactNode
  type?: 'Invoice' | 'Expense'
}) => {
  return (
    <div className='rounded-3xl border border-zinc-400/20 dark:border-zinc-600/20 p-5 w-1/4 max-w-60'>
      <div className='flex justify-between items-center'>
        <span className='text-xs font-medium text-zinc-800/40 dark:text-zinc-200/40'>
          {name}
        </span>
        <IconWrap className={color}>{icon}</IconWrap>
      </div>
      <h1 className='text-[1.75rem] leading-9 mb-3 font-semibold truncate'>
        {formatAmount(amount || 0)}
      </h1>
      <CountBadge type={type} count={count} />
    </div>
  )
}

const IconWrap = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={`p-2 rounded-full ${className}`}>{children}</div>
}

const CountBadge = ({
  count,
  type
}: {
  count: number | null
  type?: 'Invoice' | 'Expense'
}) => {
  const text = `${count || 0} ${type === 'Expense' ? 'Expenses' : 'Invoices'}`
  return (
    <Badge
      className='bg-zinc-200/40 dark:bg-zinc-700/20 py-1 px-2.5'
      variant='secondary'
    >
      {text}
    </Badge>
  )
}

const CountOverviewSuspense = () => {
  return (
    <div className='py-6 flex gap-4'>
      <div className='rounded-3xl w-1/4 max-w-60'>
        <Skeleton className='rounded-3xl h-[150px] bg-gray-500/10' />
      </div>
      <div className='rounded-3xl w-1/4 max-w-60'>
        <Skeleton className='rounded-3xl h-[150px] bg-gray-500/10' />
      </div>
      <div className='rounded-3xl w-1/4 max-w-60'>
        <Skeleton className='rounded-3xl h-[150px] bg-gray-500/10' />
      </div>
      <div className='rounded-3xl w-1/4 max-w-60'>
        <Skeleton className='rounded-3xl h-[150px] bg-gray-500/10' />
      </div>
    </div>
  )
}
