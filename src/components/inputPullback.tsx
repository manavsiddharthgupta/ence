'use client'
import { useState } from 'react'

const InputPullback = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  readonly = false
}: {
  value: string | number | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  type: string
  readonly?: boolean
}) => {
  const [focused, setIfFocused] = useState(false)

  const checkVal = (value: string | number | null) => {
    if (typeof value === 'number') {
      return true
    }
    if (value && value !== '') {
      return true
    }
    return false
  }

  const focusedInput =
    focused || checkVal(value)
      ? 'text-[8px] left-2.5 top-1 transition-all duration-100 ease-out'
      : 'top-1/2 left-2.5 -translate-y-1/2 text-xs transition-all duration-100 ease-out'

  return (
    <div className='w-full h-10 relative'>
      <input
        className='w-full h-full border-[1px] dark:border-zinc-600 border-zinc-400 bg-transparent outline-none text-xs z-10 absolute left-0 top-0 px-2.5 pt-1.5 rounded-md remove-arrow'
        type={type}
        onFocus={() => setIfFocused(true)}
        value={value === null ? '' : value}
        onBlur={(e) => {
          if (e.target.value.trim() === '') {
            setIfFocused(false)
          }
        }}
        onChange={onChange}
        readOnly={readonly}
      />
      <p
        className={`w-fit absolute dark:text-zinc-400 text-zinc-600 z-0 ${focusedInput}`}
      >
        {placeholder}
      </p>
    </div>
  )
}

export default InputPullback
