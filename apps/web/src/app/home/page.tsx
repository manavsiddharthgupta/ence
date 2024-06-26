import { Suspense } from 'react'
import CountOverview from './count-overview'
import ActivityCard from './activity'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TimeLine } from './timeline'
import { RocketIcon } from 'lucide-react'
import Link from 'next/link'

const dashboard = () => {
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <Announcements />
      <p className='text-xs leading-3 text-zinc-600/80 dark:text-zinc-300/80 font-medium'>
        Overview
      </p>
      <h1 className='text-4xl leading-9 font-semibold'>Home</h1>
      <CountOverview />
      <div className='py-6 flex justify-between'>
        <TimeLine />
        <Suspense fallback={<ActivityCardSuspense />}>
          <ActivityCard />
        </Suspense>
      </div>
    </div>
  )
}

export default dashboard

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

const Announcements = () => {
  return (
    <Alert className='dark:bg-zinc-950 mb-6 border border-zinc-400/20 dark:border-zinc-600/20'>
      <RocketIcon className='h-4 w-4' />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Due to Stripe's temporary invite-only policy in India, we are currently
        unable to upgrade our app to accept international payments. We apologize
        for the inconvenience and appreciate your understanding. Please reach
        out to{' '}
        <Link className='font-medium' href='mailto:@info.ence.in'>
          @info.ence.in
        </Link>{' '}
        if you want a feature or have a suggestion.
      </AlertDescription>
    </Alert>
  )
}
