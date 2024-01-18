import { Badge } from '@/components/ui/badge'
import { formatAmount } from '@/lib/helpers'
import {
  Banknote,
  Coins,
  FilePlus2,
  IndianRupee,
  Landmark,
  TrendingUp,
  User,
  Wallet2,
  Zap
} from 'lucide-react'

const dashboard = () => {
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <p className='text-xs leading-3 text-zinc-600/80 dark:text-zinc-300/80 font-medium'>
        Overview
      </p>
      <h1 className='text-4xl leading-9 font-semibold'>Home</h1>
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
      <div className='py-6 flex justify-between'>
        <div className='w-1/2 rounded-3xl p-4 border border-zinc-400/20 dark:border-zinc-600/20'></div>
        <ActivityCard />
      </div>
    </div>
  )
}

export default dashboard

const ActivityCard = () => {
  let actionType = 'INSTANT_CREATION'

  let icon =
    actionType === 'MANUAL_CREATION' ? (
      <FilePlus2 size={10} strokeWidth={2} />
    ) : actionType === 'PAYMENT_STATUS_CHANGE' ? (
      <Landmark size={10} strokeWidth={2} />
    ) : actionType === 'INSTANT_CREATION' ? (
      <Zap size={12} strokeWidth={2} />
    ) : actionType === 'APPROVAL_ACTION' ? (
      <User size={10} strokeWidth={2} />
    ) : (
      <IndianRupee size={10} strokeWidth={2} />
    )

  return (
    <div className='w-2/5 py-4'>
      <h2 className='text-lg font-medium'>Activity</h2>
      <div className='w-full flex flex-col gap-6 py-6 px-3'>
        <EachActivity
          key={'24'}
          trailIcon={icon}
          desc={'#INV-81: You created at Jan 16, 2024 at 11:59 PM'}
          title={'Instant Invoice Creation'}
        />
        <EachActivity
          key={'4'}
          trailIcon={<User size={12} strokeWidth={2} />}
          desc={'#INV-78: Customer approved at Jan 17, 2024 at 10:59 PM'}
          title={'Customer Approval of Invoice'}
        />
        <EachActivity
          key={'42'}
          trailIcon={<Landmark size={12} strokeWidth={2} />}
          desc={
            '#INV-78: You updated the payment status to Paid at Jan 17, 2024 at 10:59 PM'
          }
          title={'Payment Status Change'}
          isFirstorLast={true}
        />
      </div>
    </div>
  )
}

const EachActivity = ({
  trailIcon,
  title,
  desc,
  isFirstorLast = false
}: {
  trailIcon: JSX.Element
  title: string | null
  desc: string | null
  isFirstorLast?: boolean
}) => {
  return (
    <div className={`relative ${isFirstorLast ? '' : 'mb-4'}`}>
      <div className='flex gap-8 items-center'>
        <div className='z-20 bg-white dark:bg-zinc-900 border-2 border-zinc-500/10 rounded-full p-1'>
          {trailIcon}
        </div>
        <div>
          <h2 className='text-sm font-medium'>{title || '-'}</h2>
        </div>
      </div>
      <div className='ml-[56px]'>
        <p className='pl-0.5 text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5'>
          {desc}
        </p>
      </div>
      {!isFirstorLast && (
        <div className='absolute left-[10px] top-4 w-0.5 rounded-lg h-16 bg-zinc-500/10 z-10'></div>
      )}
    </div>
  )
}

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
