'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MoveLeft } from 'lucide-react'

const HomeBtn = () => {
  const router = useRouter()

  return (
    <Button
      onClick={() => {
        router.push('/home')
      }}
      className='h-fit py-1 px-4 rounded-full font-normal'
    >
      <MoveLeft size={16} strokeWidth={1.5} className='mr-2' />
      home
    </Button>
  )
}

export default HomeBtn
