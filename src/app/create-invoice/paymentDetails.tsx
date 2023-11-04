import { SelectMenu } from '@/components/selectMenu'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatAmount } from '@/lib/helpers'
import {
  PaymentInfoInitailState,
  paymentInfoReducers
} from '@/reducers/createInvoice'
import { useReducer } from 'react'

const PaymentDetails = () => {
  const [paymentInfoState, paymentInfoDispatch] = useReducer(
    paymentInfoReducers,
    PaymentInfoInitailState
  )
  const paymentTermsOptions = [
    {
      value: 'immediate',
      label: 'Immediate'
    },
    {
      value: 'net 15',
      label: 'NET 15'
    },
    {
      value: 'net 30',
      label: 'NET 30'
    },
    {
      value: 'net 60',
      label: 'NET 60'
    },
    {
      value: 'net 90',
      label: 'NET 90'
    }
  ] // Will Removed From Here

  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'digital wallets', label: 'Digital Wallets' },
    { value: 'rtgs', label: 'RTGS' }
  ] // Will Removed From Here

  const paymentStatusOptions = [
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'partially paid', label: 'Partially Paid' },
    { value: 'unpaid', label: 'Unpaid' }
  ] // Will Removed From Here

  console.log(paymentInfoState)
  const onChangeNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    paymentInfoDispatch({
      type: 'NOTES',
      payload: {
        notes: e.target.value
      }
    })
  }

  const onChangeGstPercent = (e: React.ChangeEvent<HTMLInputElement>) => {
    paymentInfoDispatch({
      type: 'GST_PERCENT',
      payload: {
        gst: e.target.value
      }
    })
  }

  const onChangeShippingCharges = (e: React.ChangeEvent<HTMLInputElement>) => {
    paymentInfoDispatch({
      type: 'SHIPPING_CHARGES',
      payload: {
        shippingCharge: e.target.value
      }
    })
  }

  const onSetPaymentTerm = (value: any) => {
    paymentInfoDispatch({
      type: 'PAYMENT_TERMS',
      payload: {
        terms: value
      }
    })
  }

  const onSetPaymentMethod = (value: any) => {
    paymentInfoDispatch({
      type: 'PAYMENT_METHOD',
      payload: {
        method: value
      }
    })
  }

  const onSetPaymentStatus = (value: any) => {
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
            className='bg-transparent dark:border-zinc-600 border-zinc-400 placeholder:dark:text-zinc-300/80 placeholder:text-zinc-700/80'
            placeholder='Type your message here.'
            id='message'
            onChange={onChangeNotes}
          />
        </div>
        <div className='max-w-xs w-full p-1'>
          <div className='flex justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5'>
            <p>Subtotal</p>
            <p>{formatAmount(73700.543)}</p>
          </div>
          <div className='flex justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5 dark:bg-zinc-800/10 bg-zinc-200/40 rounded-sm'>
            <p>GST(%)</p>
            <input
              value={paymentInfoState.gst}
              type='number'
              className='outline-none border-none w-1/3 bg-transparent text-right remove-arrow'
              onChange={onChangeGstPercent}
            />
          </div>
          <div className='flex justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5'>
            <p>Tax</p>
            <p>{formatAmount(1300)}</p>
          </div>
          <div className='flex justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5 dark:bg-zinc-800/10 bg-zinc-200/40 rounded-sm'>
            <p>Shipping Charges(₹)</p>
            <input
              value={paymentInfoState.shippingCharge}
              type='number'
              className='outline-none border-none w-1/3 bg-transparent text-right remove-arrow'
              onChange={onChangeShippingCharges}
            />
          </div>
          <div className='flex justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 my-0.5 px-2 py-1.5'>
            <p>Total</p>
            <p>{formatAmount(75004.543)}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentDetails
