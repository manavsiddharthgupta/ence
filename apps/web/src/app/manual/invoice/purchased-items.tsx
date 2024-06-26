'use client'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { useInvoiceContext } from '@/context/invoice'
import { useOrgInfo } from '@/context/org-info'
import { formatAmount } from 'helper/format'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
const CollapsiblePurchasedItems = () => {
  const [isopen, setIfOpen] = useState(false)
  const { subTotal, paymentInfoState, itemsInfoState } = useInvoiceContext()
  const {
    orgInfo: { currency_type }
  } = useOrgInfo()

  const adjustmentFee =
    +paymentInfoState.adjustmentFee >= 0
      ? +paymentInfoState.adjustmentFee
      : -+paymentInfoState.adjustmentFee

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
          <table className='w-full text-xs'>
            <thead>
              <tr className='text-zinc-800/50 dark:text-zinc-300/50 border-b border-zinc-600/20 dark:border-zinc-500/20'>
                <td className='p-2'>Name</td>
                <td className='text-center p-2'>Qty</td>
                <td className='text-right p-2'>Amount</td>
              </tr>
            </thead>
            <tbody>
              {itemsInfoState.map((item) => {
                return (
                  <tr
                    key={item.id}
                    className='border-b border-zinc-600/20 dark:border-zinc-500/20'
                  >
                    <td className='p-2'>{item.name || '-'}</td>
                    <td className='text-center p-2'>{item.quantity || 0}</td>
                    <td className='text-right p-2'>
                      {formatAmount(item.total, currency_type)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className='w-full flex justify-end'>
          <div className='w-2/6 text-xs'>
            <div className='w-full flex justify-between items-center mb-1'>
              <span className='text-zinc-800/60 dark:text-zinc-200/60'>
                Total Amount
              </span>
              <span>{formatAmount(subTotal, currency_type)}</span>
            </div>
            <div className='flex w-full justify-between relative mb-1'>
              <span className='absolute -left-4 top-1/2 -translate-y-1/2 leading-3 font-bold'>
                +
              </span>
              <span className='text-zinc-800/60 dark:text-zinc-200/60'>
                Shipping
              </span>
              <span>
                {formatAmount(+paymentInfoState.shippingCharge, currency_type)}
              </span>
            </div>
            <div className='flex w-full justify-between relative mb-1'>
              <span className='absolute -left-4 top-1/2 -translate-y-1/2 leading-3 font-bold'>
                +
              </span>
              <span className='text-zinc-800/60 dark:text-zinc-200/60'>
                Packaging
              </span>
              <span>
                {formatAmount(+paymentInfoState.packagingCharge, currency_type)}
              </span>
            </div>
            <div className='flex w-full justify-between relative mb-1'>
              <span className='absolute -left-4 top-1/2 -translate-y-1/2 leading-3 font-bold'>
                {+paymentInfoState.adjustmentFee >= 0 ? '+' : '-'}
              </span>
              <span className='text-zinc-800/60 dark:text-zinc-200/60'>
                Adjustment
              </span>
              <span>{formatAmount(adjustmentFee, currency_type)}</span>
            </div>
            <div className='flex w-full justify-between relative mb-1'>
              <span className='absolute -left-4 top-1/2 -translate-y-1/2 leading-3 font-bold'>
                -
              </span>
              <span className='text-zinc-800/60 dark:text-zinc-200/60'>
                Discount
              </span>
              <span>
                {formatAmount(
                  subTotal * (+paymentInfoState.discount / 100),
                  currency_type
                )}
              </span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default CollapsiblePurchasedItems
