'use client'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { formatAmount } from '@/lib/helpers'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
const CollapsiblePurchasedItems = () => {
  const [isopen, setIfOpen] = useState(false)
  return (
    <Collapsible open={isopen} onOpenChange={setIfOpen}>
      <div className='flex justify-center'>
        <CollapsibleTrigger asChild>
          <Button
            variant='link'
            className='text-center flex gap-2 items-center dark:text-sky-300 text-sky-600 hover:no-underline'
          >
            View Invoice Details
            {isopen ? (
              <ChevronUp className='mt-1' />
            ) : (
              <ChevronDown className='mt-1' />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
        <h1 className='font-medium text-base'>Purchased Items</h1>
        <div className='my-2 border border-zinc-600/20 dark:border-zinc-500/20 rounded-sm'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='text-zinc-800/50 dark:text-zinc-300/50 border-b border-zinc-600/20 dark:border-zinc-500/20'>
                <td className='p-2'>Name</td>
                <td className='text-center p-2'>Qty</td>
                <td className='text-right p-2'>Amount</td>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b border-zinc-600/20 dark:border-zinc-500/20'>
                <td className='p-2'>Something Uniques 2</td>
                <td className='text-center p-2'>1</td>
                <td className='text-right p-2'>{formatAmount(829)}</td>
              </tr>
              <tr>
                <td className='p-2'>Something Uniques</td>
                <td className='text-center p-2'>3</td>
                <td className='text-right p-2'>{formatAmount(7231)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='w-full flex justify-end'>
          <div className='w-2/6 text-sm'>
            <div className='w-full flex justify-between items-center mb-1'>
              <span className='text-zinc-800/60 dark:text-zinc-200/60'>
                Total Amount
              </span>
              <span>{formatAmount(5273)}</span>
            </div>
            <div className='flex w-full justify-between relative mb-1'>
              <span className='absolute -left-4 top-1/2 -translate-y-1/2 leading-3 font-bold'>
                +
              </span>
              <span className='text-zinc-800/60 dark:text-zinc-200/60'>
                Tax
              </span>
              <span>₹ 16.00</span>
            </div>
            <div className='flex w-full justify-between relative mb-1'>
              <span className='absolute -left-4 top-1/2 -translate-y-1/2 leading-3 font-bold'>
                -
              </span>
              <span className='text-zinc-800/60 dark:text-zinc-200/60'>
                Discount
              </span>
              <span>₹ 18.00</span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default CollapsiblePurchasedItems
