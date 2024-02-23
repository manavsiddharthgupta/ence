import {
  FilePlus2,
  IndianRupee,
  Landmark,
  User,
  Zap,
  Receipt
} from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getActivity } from '@/crud/invoices'
import { notFound } from 'next/navigation'
import { Desc } from './activity-desc'

type Activity = {
  id: string
  createdAt: Date
  actionType: string
  title: string | null
  description: string | null
  newStatus: string | null
  invoice: {
    invoiceNumber: number
  }
}

const ActivityCard = async () => {
  const getLastActivities = async () => {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const response = await getActivity(email)
    return JSON.parse(response)
  }

  const activitiesRes = await getLastActivities()
  if (!activitiesRes.ok) {
    notFound()
  }
  const activities: Activity[] = activitiesRes.data

  return (
    <div className='w-2/5 py-4'>
      <h2 className='text-lg font-medium'>Activity</h2>
      <div className='w-full flex flex-col gap-6 py-6 px-3'>
        {activities.map((activity, ind) => {
          let desc = <p>-</p>
          let icon = <IndianRupee size={14} strokeWidth={2} />
          switch (activity.actionType) {
            case 'MANUAL_CREATION':
              desc = (
                <Desc
                  date={activity.createdAt}
                  desc='You created this manually on'
                  invoiceNumber={`#INV-${activity.invoice.invoiceNumber}`}
                />
              )
              icon = <FilePlus2 size={14} strokeWidth={2} />
              break

            case 'INSTANT_CREATION':
              desc = (
                <Desc
                  date={activity.createdAt}
                  desc='You instantly created this on'
                  invoiceNumber={`#INV-${activity.invoice.invoiceNumber}`}
                />
              )
              icon = <Zap size={15} strokeWidth={2} />
              break

            case 'APPROVAL_ACTION':
              const formattedDesc = activity.description
                ? activity.description.slice(
                    0,
                    activity.description.length - 1
                  ) + ' on'
                : 'Approved on'
              desc = (
                <Desc
                  date={activity.createdAt}
                  desc={formattedDesc}
                  invoiceNumber={`#INV-${activity.invoice.invoiceNumber}`}
                />
              )
              icon = <User size={14} strokeWidth={2} />
              break

            case 'PAYMENT_STATUS_CHANGE':
              desc = (
                <Desc
                  date={activity.createdAt}
                  desc={`You updated the payment status to ${activity.newStatus?.toLowerCase()} on`}
                  invoiceNumber={`#INV-${activity.invoice.invoiceNumber}`}
                />
              )
              icon = <Landmark size={14} strokeWidth={2} />
              break

            case 'RECEIPT_SEND_STATUS_CHANGE':
              desc = (
                <Desc
                  date={activity.createdAt}
                  desc='Customer recieved the receipt on'
                  invoiceNumber={`#INV-${activity.invoice.invoiceNumber}`}
                />
              )
              icon = <Receipt size={14} strokeWidth={2} />
              break

            default:
              break
          }
          return (
            <EachActivity
              key={activity.id}
              trailIcon={icon}
              desc={desc}
              title={activity.title}
              isFirstorLast={activities.length - 1 === ind}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ActivityCard

const EachActivity = ({
  trailIcon,
  title,
  desc,
  isFirstorLast = false
}: {
  trailIcon: JSX.Element
  title: string | null
  desc: JSX.Element
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
      <div className='ml-[56px]'>{desc}</div>
      {!isFirstorLast && (
        <div className='absolute left-3 top-6 w-0.5 rounded-lg h-20 bg-zinc-500/10 z-10'></div>
      )}
    </div>
  )
}
