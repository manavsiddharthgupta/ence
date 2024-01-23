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
        <Suspense fallback={<ActivityCardSuspense />}>
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
  return (
    <div className='w-2/5 py-4'>
      <h2 className='text-lg font-medium'>Activity</h2>
      <div className='w-full flex flex-col gap-6 py-6 px-3'>
        <EachActivitySkeleton />
        <EachActivitySkeleton />
        <EachActivitySkeleton last={true} />
      </div>
    </div>
  )
}

const EachActivitySkeleton = ({ last }: { last?: boolean }) => {
  return (
    <div className='relative mb-4'>
      <div className='flex gap-8 items-center'>
        <div className='z-20 w-7 h-7 bg-white dark:bg-zinc-900 border-2 border-zinc-500/10 rounded-full'></div>
        <div className='w-2/3'>
          <Skeleton className='rounded-3xl h-5 bg-gray-500/10' />
        </div>
        {!last && (
          <div className='absolute left-3 top-5 w-0.5 rounded-lg h-16 bg-zinc-500/10 z-10'></div>
        )}
      </div>
      <div className='ml-[56px] w-3/4 mt-2'>
        <Skeleton className='rounded-3xl h-3 bg-gray-500/10' />
      </div>
    </div>
  )
}
