'use client'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

const CustomerFilter = () => {
  const [search, setSearch] = useState('')
  return (
    <div className='flex justify-between items-center mb-4'>
      <div className='flex gap-2'>
        <Input
          value={search || ''}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          placeholder='Search Customer...'
          type='text'
          className='h-9 max-w-xs bg-transparent dark:border-zinc-700 border-zinc-200 hover:bg-zinc-100/80 hover:dark:bg-zinc-800/50 min-w-[300px]'
        />
      </div>
    </div>
  )
}

export default CustomerFilter
