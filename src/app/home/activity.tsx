import { FilePlus2, IndianRupee, Landmark, User, Zap } from 'lucide-react'

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
          invoiceNumber='#INV-81'
          desc={'You created at Jan 16, 2024 at 11:59 PM'}
          title={'Instant Invoice Creation'}
        />
        <EachActivity
          key={'4'}
          trailIcon={<User size={12} strokeWidth={2} />}
          invoiceNumber='#INV-78'
          desc={'Customer approved at Jan 17, 2024 at 10:59 PM'}
          title={'Customer Approval of Invoice'}
        />
        <EachActivity
          key={'42'}
          trailIcon={<Landmark size={12} strokeWidth={2} />}
          invoiceNumber='#INV-78'
          desc={
            'You updated the payment status to Paid at Jan 17, 2024 at 10:59 PM'
          }
          title={'Payment Status Change'}
          isFirstorLast={true}
        />
      </div>
    </div>
  )
}

export default ActivityCard

const EachActivity = ({
  trailIcon,
  title,
  desc,
  invoiceNumber,
  isFirstorLast = false
}: {
  trailIcon: JSX.Element
  title: string | null
  desc: string | null
  invoiceNumber: string
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
          {`${invoiceNumber}: ${desc}`}
        </p>
      </div>
      {!isFirstorLast && (
        <div className='absolute left-[10px] top-4 w-0.5 rounded-lg h-16 bg-zinc-500/10 z-10'></div>
      )}
    </div>
  )
}
