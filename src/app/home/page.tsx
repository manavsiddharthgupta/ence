import { Suspense } from 'react'
import CountOverview from './count-overview'
import ActivityCard from './activity'
import { Skeleton } from '@/components/ui/skeleton'

const dashboard = () => {
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <p className='text-xs leading-3 text-zinc-600/80 dark:text-zinc-300/80 font-medium'>
        Overview
      </p>
      <h1 className='text-4xl leading-9 font-semibold'>Home</h1>
      <Suspense fallback={<CountOverviewSuspense />}>
        <CountOverview />
      </Suspense>
      <div className='py-6 flex justify-between'>
        <div className='w-1/2 rounded-3xl p-4 border border-zinc-400/20 dark:border-zinc-600/20'></div>
        <Suspense>
          <ActivityCard />
        </Suspense>
      </div>
    </div>
  )
}

export default dashboard

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

const ActivityCardSuspense = () => {
  return <div></div>
}
