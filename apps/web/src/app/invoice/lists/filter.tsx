'use client'
import { Input } from '@/components/ui/input'
import { DatePickerWithRange } from '@/components/ui/datepicker-with-range'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { addDays } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'

const Filter = () => {
  const [search, setSearch] = useState<string | null>(null)
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20)
  })
  const [selectedStatus, onSelectStatus] = useState<string[]>([])
  const [query] = useDebounce(search, 800)
  const [filterredStatus] = useDebounce(selectedStatus, 800)
  const router = useRouter()
  // useEffect(() => {
  //   if (query) {
  //     router.push(`/invoice/lists?search=${query}`)
  //   } else {
  //     router.push('/invoice/lists')
  //   }
  // }, [query])
  useEffect(() => {
    const queryParams = []

    if (query) {
      queryParams.push(`search=${query}`)
    }

    if (filterredStatus.length > 0) {
      queryParams.push(`status=${filterredStatus.join(',')}`)
    }

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join('&')}` : ''

    router.push(`/invoice/lists${queryString}`)
  }, [query, filterredStatus])

  const checkIfStatusSelected = (status: string) => {
    return selectedStatus.includes(status)
  }

  const onCheckStatus = (status: string, val: boolean) => {
    if (val) {
      onSelectStatus(() => {
        return [...selectedStatus, status]
      })
    } else {
      const filteredStatus = selectedStatus.filter((checkedStatus) => {
        return checkedStatus !== status
      })
      onSelectStatus(() => {
        return [...filteredStatus]
      })
    }
  }

  const statusTypes = [
    { label: 'Paid', value: 'PAID' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Due', value: 'DUE' },
    { label: 'Partially', value: 'PARTIALLY_PAID' }
  ]
  return (
    <div className='flex justify-between items-center mb-4'>
      <div className='flex gap-2'>
        <Input
          value={search || ''}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          placeholder='Search Invoices...'
          type='text'
          className='h-9 max-w-xs bg-transparent dark:border-zinc-700 border-zinc-200 hover:bg-zinc-100/80 hover:dark:bg-zinc-800/50 min-w-[300px]'
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className='border-dashed border bg-transparent dark:border-zinc-600 border-zinc-300 hover:bg-zinc-100/80 hover:dark:bg-zinc-800/50 text-sm font-normal dark:text-zinc-400 text-zinc-600'
              size='sm'
            >
              <PlusCircledIcon className='mr-1 dark:text-zinc-400 text-zinc-600' />
              <span className='pr-1.5'>Status</span>
              {selectedStatus.length > 0 && (
                <span className='border-l dark:border-zinc-600 border-zinc-400 h-3/5'></span>
              )}
              {selectedStatus.length < 3 ? (
                selectedStatus.map((status) => {
                  const formattedStatus = statusTypes.find((each) => {
                    return each.value === status
                  })
                  return (
                    <Badge
                      key={status}
                      className='dark:bg-zinc-700 bg-zinc-200 hover:dark:bg-zinc-700/70 hover:bg-zinc-200/70 text-zinc-900 dark:text-zinc-100 ml-1.5'
                    >
                      {formattedStatus?.label}
                    </Badge>
                  )
                })
              ) : (
                <Badge className='dark:bg-zinc-700 bg-zinc-200 hover:dark:bg-zinc-700/70 hover:bg-zinc-200/70 text-zinc-900 dark:text-zinc-100 ml-1.5'>
                  {selectedStatus.length} Selected
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-36 p-1 dark:border-zinc-600 border-zinc-400 dark:bg-zinc-900 bg-white flex flex-col'
            align='start'
          >
            {statusTypes.map((status) => {
              return (
                <label
                  key={status.label}
                  htmlFor={status.label}
                  className='flex gap-2 items-center py-2 px-2 hover:dark:bg-zinc-700/70 hover:bg-zinc-200/70 rounded-md text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  <Checkbox
                    checked={checkIfStatusSelected(status.value)}
                    onCheckedChange={(val: boolean) => {
                      onCheckStatus(status.value, val)
                    }}
                    id={status.label}
                  />
                  <span>{status.label}</span>
                </label>
              )
            })}
          </PopoverContent>
        </Popover>
      </div>

      <DatePickerWithRange disabled date={date} setDate={setDate} />
    </div>
  )
}

export default Filter
