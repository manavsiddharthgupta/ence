import { formatDateTime } from '@/lib/helpers'
import { InvoiceAuditTrail } from '@/types/invoice'
import {
  FilePlus2,
  IndianRupee,
  Landmark,
  MoveRight,
  Zap,
  User
} from 'lucide-react'

const AuditTrail = ({
  auditTrail
}: {
  auditTrail: InvoiceAuditTrail | undefined
}) => {
  if (!auditTrail) {
    return (
      <div className='my-4 py-8'>
        <p className='text-xs text-center font-medium'>No history available.</p>
      </div>
    )
  }

  return (
    <div className='my-4 py-8 pl-14'>
      {auditTrail.map((trail, ind) => {
        let icon =
          trail.actionType === 'MANUAL_CREATION' ? (
            <FilePlus2 size={18} strokeWidth={2} />
          ) : trail.actionType === 'PAYMENT_STATUS_CHANGE' ? (
            <Landmark size={18} strokeWidth={2} />
          ) : trail.actionType === 'INSTANT_CREATION' ? (
            <Zap size={18} strokeWidth={2} />
          ) : trail.actionType === 'APPROVAL_ACTION' ? (
            <User size={18} strokeWidth={2} />
          ) : (
            <IndianRupee size={18} strokeWidth={2} />
          )
        return (
          <EachTrail
            key={trail.id}
            trailIcon={icon}
            desc={trail.description}
            newState={trail.newStatus}
            oldState={trail.oldStatus}
            time={formatDateTime(trail.createdAt)}
            title={trail.title}
            isFirstorLast={ind === auditTrail.length - 1}
          />
        )
      })}
    </div>
  )
}

export default AuditTrail

const EachTrail = ({
  trailIcon,
  title,
  desc,
  oldState,
  newState,
  time,
  isFirstorLast = false
}: {
  trailIcon: JSX.Element
  title: string | null
  desc: string | null
  oldState: string | null
  newState: string | null
  time: string
  isFirstorLast?: boolean
}) => {
  return (
    <div className='mb-20 relative'>
      <div className='flex gap-8 items-center'>
        <div className='z-20 bg-white dark:bg-zinc-900 border-2 border-zinc-500/10 rounded-full p-2'>
          {trailIcon}
        </div>
        <div>
          <h2 className='text-sm font-semibold'>{title || '-'}</h2>
          <p className='text-xs text-zinc-700 dark:text-zinc-200'>
            {desc || '-'}
          </p>
        </div>
      </div>
      <div className='ml-[70px]'>
        <div className='mt-2 flex items-center gap-2'>
          <div className='py-0.5 px-2 bg-yellow-200/80 text-yellow-800 font-semibold text-xs rounded-md'>
            {oldState || '-'}
          </div>
          <MoveRight className='text-zinc-500' strokeWidth={1} />
          <div className='py-0.5 px-2 bg-green-200/80 text-green-800 font-semibold text-xs rounded-md'>
            {newState || '-'}
          </div>
        </div>
        <p className='pl-0.5 text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5'>
          {time}
        </p>
      </div>
      {!isFirstorLast && (
        <div className='absolute left-[19px] top-3 w-0.5 rounded-lg h-44 bg-zinc-500/10 z-10'></div>
      )}
    </div>
  )
}
