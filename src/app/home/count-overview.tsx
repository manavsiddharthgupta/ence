import { Badge } from '@/components/ui/badge'
import { formatAmount } from '@/lib/helpers'
import { Banknote, Coins, TrendingUp, Wallet2 } from 'lucide-react'

const CountOverview = () => {
  return (
    <div className='py-6 flex gap-4'>
      <OverviewCard
        name='SALES'
        amount={189078}
        color='bg-sky-500/10 text-sky-500'
        count={53}
        icon={<TrendingUp size={18} strokeWidth={1.5} />}
      />
      <OverviewCard
        name='PAID'
        amount={85002}
        color='bg-green-500/10 text-green-500'
        count={32}
        icon={<Banknote size={18} strokeWidth={1.5} />}
      />
      <OverviewCard
        name='UNPAID'
        amount={104076}
        color='bg-red-500/10 text-red-500'
        count={21}
        icon={<Coins size={18} strokeWidth={1.5} />}
      />
      <OverviewCard
        name='EXPENSE'
        amount={4076}
        color='bg-yellow-500/10 text-yellow-500'
        count={9}
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
      <h1 className='text-3xl mb-3 font-semibold'>
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
  const text = `${count} ${type === 'Expense' ? 'Expenses' : 'Invoices'}`
  return (
    <Badge
      className='bg-zinc-200/40 dark:bg-zinc-700/20 py-1 px-2.5'
      variant='secondary'
    >
      {text}
    </Badge>
  )
}
