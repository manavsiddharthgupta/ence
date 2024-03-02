'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MoveLeft } from 'lucide-react'
import { Beta } from './beta-badge'

const BackBtn = ({ isBeta }: { isBeta?: boolean }) => {
  const router = useRouter()

  return (
    <div className='flex items-center justify-between'>
      <Button
        onClick={() => {
          router.back()
        }}
        className='h-fit py-1 px-4 rounded-full font-medium'
      >
        <MoveLeft size={18} strokeWidth={2} className='mr-2' />
        back
      </Button>
      {isBeta && <Beta />}
    </div>
  )
}

export default BackBtn
