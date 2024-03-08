'use client'
import { Card, CardContent } from '@/components/ui/card'
import { MAX_FREE_COUNT } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import { Progress } from './ui/progress'

const FreeTrialCount = ({ isPro }: { isPro: boolean }) => {
  if (isPro) {
    return <div className=' h-[128px]'></div>
  }

  const { isPending, error, data } = useQuery({
    queryKey: ['api-limit'],
    queryFn: () => fetch(`/api/limit-count`).then((res) => res.json())
  })
  if (isPending) {
    return <div className=' h-[128px]'></div>
  }

  if (error) {
    return <div className=' h-[128px]'></div>
  }

  if (!data.ok) {
    return <div className=' h-[128px]'></div>
  }

  const INSTANT_INVOICE = data?.data?.INSTANT_INVOICE || 0
  const RESEND_MAIL = data?.data?.RESEND_MAIL || 0

  return (
    <Card className='bg-zinc-900/5 dark:bg-white/5 border-none shadow-none'>
      <CardContent className='text-center p-4'>
        <h3 className='text-base font-semibold bg-gradient-to-r from-[#D4145A] to-[#FBB03B] inline-block text-transparent bg-clip-text'>
          Free Trial
        </h3>
        <div className='text-xs text-left my-1.5 flex flex-col gap-1.5'>
          <p>
            {INSTANT_INVOICE} / {MAX_FREE_COUNT.INSTANT_INVOICE} Instant Invoice
          </p>
          <Progress
            value={(INSTANT_INVOICE / MAX_FREE_COUNT.INSTANT_INVOICE) * 100}
          />
        </div>
        <div className='text-xs text-left flex flex-col gap-1.5'>
          <p>
            {RESEND_MAIL} / {MAX_FREE_COUNT.RESEND_MAIL} Send Mail
          </p>
          <Progress value={(RESEND_MAIL / MAX_FREE_COUNT.RESEND_MAIL) * 100} />
        </div>
      </CardContent>
    </Card>
  )
}
export default FreeTrialCount
