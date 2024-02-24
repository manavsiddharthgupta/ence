import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Option } from '@/types/invoice'
import { SheetTrigger } from '@/components/ui/sheet'
import { Loader } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'

const baseurl = process.env.NEXT_PUBLIC_API_URL

function InputCombobox({
  selectedValue,
  setSelectedValue,
  query,
  onSetQuery: setQuery
}: {
  selectedValue: Option | null
  setSelectedValue: Dispatch<SetStateAction<Option | null>>
  query: string
  onSetQuery: Dispatch<SetStateAction<string>>
}) {
  const [focused, setIfFocused] = useState(false)
  // const [isPending, setPending] = useState(false)
  // const [error, setError] = useState(false)
  // const [options, setOptions] = useState<Option[]>([])

  const [debouncedSearchInput] = useDebounce(query, 600)

  // useEffect(() => {
  //   const searchCustomer = async () => {
  //     setPending(true)
  //     const res = await fetch(
  //       `/api/customer/search?query=${debouncedSearchInput}`
  //     )
  //     const data = await res.json()
  //     if (!data.ok) {
  //       setError(true)
  //     } else {
  //       const customers = await data.data
  //       setOptions(customers)
  //     }
  //     setPending(false)
  //   }
  //   searchCustomer()
  // }, [debouncedSearchInput])

  const { isPending, error, data } = useQuery({
    queryKey: ['customers', { searchInput: debouncedSearchInput }],
    queryFn: () =>
      fetch(
        `${baseurl}/api/customer/search?query=${debouncedSearchInput}`
      ).then((res) => res.json())
  })

  const options: Option[] = data?.data || []

  const focusedInput =
    focused || selectedValue?.legalName !== undefined
      ? 'text-[8px] left-2.5 top-1 transition-all duration-100 ease-out'
      : 'top-1/2 left-2.5 -translate-y-1/2 text-xs transition-all duration-100 ease-out'

  return (
    <Combobox value={selectedValue} onChange={setSelectedValue}>
      <div className='relative w-full'>
        <div className='w-full h-10 relative'>
          <Combobox.Input
            className='w-full h-full border-[1px] dark:border-zinc-600/30 border-zinc-400/30 bg-transparent outline-none text-xs z-10 absolute left-0 top-0 px-2.5 pt-1.5 rounded-md'
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(option: Option) => option?.legalName}
            onFocus={() => setIfFocused(true)}
            onBlur={(e) => {
              if (selectedValue?.legalName === undefined) {
                setTimeout(() => {
                  setIfFocused(false)
                }, 200)
              }
            }}
          />
          <p
            className={`w-fit absolute dark:text-zinc-400 text-zinc-600 z-0 ${focusedInput}`}
          >
            Customer Legal Name
          </p>
        </div>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-0'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
          // afterLeave={() => setQuery('')}
        >
          <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md dark:bg-zinc-700 bg-zinc-300 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50'>
            {query.length > 0 && (
              <Combobox.Option
                value={null}
                className='relative cursor-default select-none py-2 px-4 text-black dark:text-white'
              >
                <SheetTrigger className='underline'>
                  Click here to create "{query}"
                </SheetTrigger>
              </Combobox.Option>
            )}
            {options.map((option) => (
              <Combobox.Option
                key={option.id}
                value={option}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'dark:text-white text-black'
                  }`
                }
              >
                {option.legalName}
                <span className='text-xs font-semibold'>
                  {'  -  '}
                  <p>{option.email}</p>
                  <p>{option.whatsAppNumber}</p>
                </span>
              </Combobox.Option>
            ))}
            {isPending && (
              <Loader size={18} className='mx-auto animate-spin my-2' />
            )}
            {!isPending && options.length === 0 && (
              <p className='py-2 mx-auto w-fit'>No customer to show</p>
            )}
            {!isPending && error && (
              <p className='py-2 mx-auto w-fit text-red-500'>
                Something went wrong
              </p>
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

export default InputCombobox
