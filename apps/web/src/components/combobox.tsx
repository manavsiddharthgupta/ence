import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Option } from '@/types/invoice'

function InputCombobox({
  selectedValue,
  setSelectedValue,
  options
}: {
  selectedValue: string
  setSelectedValue: Dispatch<SetStateAction<string>>
  options: Option[]
}) {
  const [query, setQuery] = useState('')
  const [focused, setIfFocused] = useState(false)

  const filteredPeople =
    query === ''
      ? options
      : options.filter((option) => {
          return option.value.toLowerCase().includes(query.toLowerCase())
        })

  const focusedInput =
    focused || selectedValue !== ''
      ? 'text-[8px] left-2.5 top-1 transition-all duration-100 ease-out'
      : 'top-1/2 left-2.5 -translate-y-1/2 text-xs transition-all duration-100 ease-out'

  return (
    <Combobox value={selectedValue} onChange={setSelectedValue}>
      <div className='relative w-full'>
        <div className='w-full h-10 relative'>
          <Combobox.Input
            className='w-full h-full border-[1px] dark:border-zinc-600 border-zinc-400 bg-transparent outline-none text-xs z-10 absolute left-0 top-0 px-2.5 pt-1.5 rounded-md'
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(option: Option) => option.value}
            onFocus={() => setIfFocused(true)}
            onBlur={(e) => {
              if (selectedValue === '') {
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
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md dark:bg-zinc-700 bg-zinc-300 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20'>
            {query.length > 0 && (
              <Combobox.Option
                value={{ id: null, value: query }}
                className='relative cursor-default select-none py-2 px-4 text-black dark:text-white'
              >
                Create "{query}"
              </Combobox.Option>
            )}
            {filteredPeople.map((option) => (
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
                {option.value}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

export default InputCombobox
