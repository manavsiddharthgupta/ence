import Tip from '@/components/component-tip'
import { SelectMenu } from '@/components/selectMenu'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import UploadFile from '@/components/upload-files'
import { useInvoiceContext } from '@/context/invoice'
import { callInfoToast } from '@/lib/helpers'
import { formatAmount } from 'helper/format'
import { HelpCircle } from 'lucide-react'
import {
  PAYMENT_TERMS as paymentTermsOptions,
  PAYMENT_STATUS_OPTIONS as paymentStatusOptions,
  PAYMENT_OPTION as paymentMethodOptions
} from '@/lib/constants'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
const PaymentDetails = () => {
  const {
    paymentInfoState,
    paymentInfoDispatch,
    invoiceInfoDispatch,
    subTotal
  } = useInvoiceContext()

  const onChangeNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    paymentInfoDispatch({
      type: 'NOTES',
      payload: {
        notes: e.target.value
      }
    })
  }

  const onChangeDiscountPercent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value > 100 || +e.target.value < 0) {
      return
    }
    paymentInfoDispatch({
      type: 'DISCOUNT_PERCENT',
      payload: {
        discount: e.target.value
      }
    })
  }

  const onChangePackagingCharge = (e: React.ChangeEvent<HTMLInputElement>) => {
    paymentInfoDispatch({
      type: 'PACKAGE_CHARGE',
      payload: {
        packagingCharge: e.target.value
      }
    })
  }

  const onChangeShippingCharge = (e: React.ChangeEvent<HTMLInputElement>) => {
    paymentInfoDispatch({
      type: 'SHIPPING_CHARGES',
      payload: {
        shippingCharge: e.target.value
      }
    })
  }

  const onChangeAdjustmentFee = (e: React.ChangeEvent<HTMLInputElement>) => {
    paymentInfoDispatch({
      type: 'ADJUSTMENT_FEE',
      payload: {
        adjustmentFee: e.target.value
      }
    })
  }

  const onSetPaymentTerm = (value: any) => {
    if (!value) {
      return
    }

    if (value !== 'immediate' && value !== 'custom') {
      callInfoToast('This feature is currently unavailable in Beta.')
      return
    } // For Beta
    paymentInfoDispatch({
      type: 'PAYMENT_TERMS',
      payload: {
        terms: value
      }
    })

    if (value === 'immediate') {
      invoiceInfoDispatch({
        type: 'INVOICE_DUE_DATE',
        payload: { dueDate: new Date() }
      })
    }

    // Todo: change to switch case
  }

  const onSetPaymentMethod = (value: any) => {
    if (!value) {
      return
    }

    if (value === 'rtgs' || value === 'digital wallets') {
      callInfoToast('This feature is currently unavailable in Beta.')
      return
    } // For Beta
    paymentInfoDispatch({
      type: 'PAYMENT_METHOD',
      payload: {
        method: value
      }
    })
  }

  const onSetPaymentStatus = (value: any) => {
    if (!value) {
      return
    }

    if (value === 'partially paid') {
      callInfoToast('This feature is currently unavailable in Beta.')
      return
    } // For Beta
    paymentInfoDispatch({
      type: 'PAYMENT_STATUS',
      payload: {
        status: value
      }
    })
  }
  return (
    <>
      <h3 className='text-lg'>Payment info</h3>
      <div className='flex justify-between mt-2 gap-4 items-center'>
        <div className='w-[30%]'>
          <p className='text-[10px] font-light dark:text-zinc-400 text-zinc-600 mb-1 ml-1'>
            Payment Terms
          </p>
          <SelectMenu
            value={paymentInfoState.terms}
            setValue={onSetPaymentTerm}
            options={paymentTermsOptions}
            label='Select Payment terms'
          />
        </div>
        <div className='w-[30%]'>
          <p className='text-[10px] font-light dark:text-zinc-400 text-zinc-600 mb-1 ml-1'>
            Payment Methods
          </p>
          <SelectMenu
            value={paymentInfoState.method}
            setValue={onSetPaymentMethod}
            options={paymentMethodOptions}
            label='Select Payment Method'
          />
        </div>
        <div className='w-[30%]'>
          <p className='text-[10px] font-light dark:text-zinc-400 text-zinc-600 mb-1 ml-1'>
            Payment Status
          </p>
          <SelectMenu
            value={paymentInfoState.status}
            setValue={onSetPaymentStatus}
            options={paymentStatusOptions}
            label='Select Payment Status'
            disabled
          />
        </div>
      </div>
      <div className='flex mt-4 mb-12 justify-between'>
        <div className='w-full max-w-sm'>
          <Label
            htmlFor='message'
            className='text-[10px] font-light dark:text-zinc-400 text-zinc-600 ml-1 leading-6'
          >
            Notes/Memo
          </Label>
          <Textarea
            className='bg-transparent dark:border-zinc-600/40 border-zinc-400/40 placeholder:dark:text-zinc-300/80 placeholder:text-zinc-700/80 text-xs'
            placeholder='Type your message here.'
            id='message'
            onChange={onChangeNotes}
            value={paymentInfoState.notes}
          />
          {/* <div className='mt-4'>
            <UploadFile />
          </div> */}
        </div>
        <div className='max-w-xs w-full p-1 mt-2'>
          <div className='flex justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5'>
            <p>Subtotal</p>
            <p>{formatAmount(subTotal)}</p>
          </div>
          <div className='flex justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5 dark:bg-zinc-800/10 bg-zinc-200/40 rounded-sm'>
            <p>Discount(%)</p>
            <input
              value={paymentInfoState.discount}
              type='number'
              className='outline-none border-none w-1/3 bg-transparent text-right remove-arrow'
              onChange={onChangeDiscountPercent}
            />
          </div>
          <div className='flex justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5'>
            <div className='flex gap-1 items-center'>
              <Popover>
                <PopoverTrigger asChild>
                  <p className='cursor-pointer underline'>Additional Charges</p>
                </PopoverTrigger>
                <PopoverContent
                  align='center'
                  sideOffset={15}
                  side='left'
                  className='w-44 p-2 z-10 dark:bg-zinc-950 dark:border-zinc-700'
                >
                  <button className='w-full cursor-text text-sm text-center font-medium'>
                    Additional Charges
                  </button>
                  <Separator className='my-1 h-[0.5px] dark:bg-zinc-700 bg-zinc-300' />
                  <div className='flex justify-between w-full text-xs font-normal text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1'>
                    <p>Packaging(₹)</p>
                    <input
                      autoFocus
                      value={paymentInfoState.packagingCharge}
                      type='number'
                      className='outline-none border-none w-2/5 bg-transparent text-black dark:text-white text-right remove-arrow'
                      onChange={onChangePackagingCharge}
                    />
                  </div>
                  <div className='flex justify-between w-full text-xs font-normal text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5'>
                    <p>Shipping(₹)</p>
                    <input
                      value={paymentInfoState.shippingCharge}
                      type='number'
                      className='outline-none border-none w-2/5 bg-transparent text-black dark:text-white text-right remove-arrow'
                      onChange={onChangeShippingCharge}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Tip info='Packaging Charge + Shipping Charge'>
                <HelpCircle size={10} strokeWidth={2.5} className='mt-0.5' />
              </Tip>
            </div>
            <p>{formatAmount(+paymentInfoState.additionalCharges)}</p>
          </div>
          <div className='flex justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5 dark:bg-zinc-800/10 bg-zinc-200/40 rounded-sm'>
            <div className='flex gap-1 items-center'>
              <p>Adjustment(₹)</p>
              <Tip info='Extra +ve or -ve charges applied to adjust the amount'>
                <HelpCircle size={10} strokeWidth={2.5} className='mt-0.5' />
              </Tip>
            </div>
            <input
              value={paymentInfoState.adjustmentFee}
              type='number'
              className='outline-none border-none w-1/3 bg-transparent text-right remove-arrow'
              onChange={onChangeAdjustmentFee}
            />
          </div>
          <div className='flex justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5'>
            <p>Total</p>
            <p>
              {formatAmount(
                subTotal +
                  +paymentInfoState.adjustmentFee +
                  +paymentInfoState.additionalCharges -
                  subTotal * (+paymentInfoState.discount / 100)
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentDetails
