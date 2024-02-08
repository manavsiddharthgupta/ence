'use client'

import { Dispatch, SetStateAction } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

const InputDate = ({
  value,
  onChange,
  placeholder,
  disabled
}: {
  value: Date | undefined
  onChange?: Dispatch<SetStateAction<Date | undefined>>
  placeholder: string
  disabled?: boolean
}) => {
  const checkVal = (value: Date | undefined) => {
    return !!value
  }

  const focusedInput = checkVal(value)
    ? 'text-[8px] left-2.5 top-1 transition-all duration-100 ease-out'
    : 'top-1/2 left-2.5 -translate-y-1/2 text-xs transition-all duration-100 ease-out'

  return (
    <div className={`w-full h-10 relative ${disabled ? 'opacity-65' : ''}`}>
      <div className='w-full h-full border-[1px] dark:border-zinc-600/30 border-zinc-400/30 bg-transparent outline-none text-xs z-10 absolute left-0 top-0 px-2.5 pt-1.5 rounded-md'></div>
      <p
        className={`w-fit absolute dark:text-zinc-400 text-zinc-600 z-0 ${focusedInput}`}
      >
        {placeholder}
      </p>
      {value && (
        <span className='absolute top-[60%] left-3 -translate-y-1/2 text-xs'>
          {format(value, 'dd-MM-yyyy')}
        </span>
      )}
      <div className='absolute top-1/2 right-4 -translate-y-1/2 z-20'>
        <Popover>
          <PopoverTrigger disabled={disabled}>
            <CalendarIcon className='h-4 w-4' />
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0 z-20 dark:border-zinc-600 border-zinc-400 dark:bg-zinc-900 bg-white'>
            <Calendar
              mode='single'
              selected={value}
              onSelect={onChange}
              initialFocus
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default InputDate
