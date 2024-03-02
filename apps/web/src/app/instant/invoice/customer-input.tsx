import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Option } from '@/types/invoice'
import { Loader } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { InstantInvoiceAction } from '@/types/instant'

const baseurl = process.env.NEXT_PUBLIC_API_URL

function InstantInputCombobox({
  selectedValue,
  setSelectedValue,
  query,
  onSetQuery: setQuery
}: {
  selectedValue: Option | null
  setSelectedValue: Dispatch<SetStateAction<Option | null>>
  query: string
  onSetQuery: Dispatch<InstantInvoiceAction>
}) {
  const [debouncedSearchInput] = useDebounce(query, 600)

  const { isPending, error, data } = useQuery({
    queryKey: ['customers', { searchInput: debouncedSearchInput }],
    queryFn: () =>
      fetch(
        `${baseurl}/api/customer/search?query=${debouncedSearchInput}`
      ).then((res) => res.json())
  })

  const options: Option[] = data?.data || []

  return (
    <Combobox value={selectedValue} onChange={setSelectedValue}>
      <div className='relative w-full'>
        <div className='w-full h-10 max-w-xs relative'>
          <Combobox.Input
            className='w-full h-full border-[1px] dark:border-zinc-600/30 border-zinc-400/30 bg-transparent outline-none text-sm z-10 absolute left-0 top-0 px-2.5 rounded-md'
            onChange={(event) =>
              setQuery({
                type: 'CUSTOMER_NAME',
                payload: { customerName: event.target.value }
              })
            }
            displayValue={(option: Option) => option?.legalName}
          />
        </div>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-0'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
          afterLeave={() =>
            setQuery({
              type: 'CUSTOMER_NAME',
              payload: { customerName: '' }
            })
          }
        >
          <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md dark:bg-zinc-700 bg-zinc-300 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50'>
            {query.length > 0 && (
              <Combobox.Option
                value={null}
                className='relative cursor-default select-none py-2 px-4 text-black dark:text-white'
              >
                Query - "{query}"
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
                <div className='flex items-center gap-1'>
                  <p className='text-sm w-1/2 truncate'>{option.legalName}</p>
                  <div className='w-1/2 truncate flex flex-col text-xs font-medium'>
                    <p>{option.email}</p>
                    <p>{option.whatsAppNumber}</p>
                  </div>
                </div>
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

export default InstantInputCombobox
