import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CheckCircle2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

export function CustomRadioGroup({
  value,
  setValue,
  options
}: {
  value: string
  setValue: Dispatch<SetStateAction<string>>
  options: { label: string; value: string }[]
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(value) => {
        setValue(value)
      }}
      className='flex gap-1.5 items-center'
    >
      {options.map((option) => {
        return (
          <div key={option.label} className='flex items-center space-x-2'>
            <RadioGroupItem
              className='hidden'
              value={option.value}
              id={option.value}
            ></RadioGroupItem>
            <Label
              className={`${
                value === option.value
                  ? 'border border-zinc-400/40 dark:border-zinc-600/40 py-2 px-3 rounded-full flex gap-1'
                  : 'font-normal'
              } px-3 py-2 cursor-pointer`}
              htmlFor={option.value}
            >
              {value === option.value && (
                <CheckCircle2 size={14} strokeWidth={2.5} />
              )}
              {option.label}
            </Label>
          </div>
        )
      })}
    </RadioGroup>
  )
}
