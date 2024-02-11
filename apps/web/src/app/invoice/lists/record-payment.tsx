import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { InvoicesResponse } from '@/types/invoice'
import { Dot, IndianRupee, Loader } from 'lucide-react'
import { callErrorToast, callSuccessToast } from '@/lib/helpers'
import { formatAmount, formatDate } from 'helper/format'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import { DatePicker } from '@/components/ui/date-picker'
import { CustomRadioGroup } from '@/components/custom-radio-group'
import { PAYMENT_OPTION as paymentOption } from '@/lib/constants'
import { paymentRecord } from '@/validator/schema'

export const RecordPayment = ({
  invoice,
  onClosePaymentDialog
}: {
  invoice: InvoicesResponse | undefined
  onClosePaymentDialog: () => void
}) => {
  const [amountToPay, setAmountToPay] = useState(invoice?.dueAmount || '')
  const [paymentDate, setPaymnetDate] = useState<Date | undefined>(new Date())
  const [paymentType, setPaymentType] = useState(paymentOption[0].value)
  const [isPending, setPending] = useState(false)
  const router = useRouter()

  const onChangePaymentStatus = async (invoiceId: string) => {
    setPending(true)
    const response = await fetch(`/api/invoice/${invoiceId}/payment-record`, {
      method: 'PATCH',
      body: JSON.stringify({
        amount: +amountToPay,
        paymentDate: paymentDate,
        paymentType: paymentType
      })
    })
    const paidRes = await response.json()
    return paidRes
  }

  const onRecordPayment = async () => {
    try {
      paymentRecord.parse({
        amount: +amountToPay,
        paymentDate: paymentDate,
        paymentType: paymentType
      })
    } catch (err: any) {
      console.log(err)
      callErrorToast(err[0]?.message || 'Invalid Payment Record Data')
      return
    }
    if (!invoice || !invoice.id) {
      return
    }
    if (+amountToPay > invoice.dueAmount || +amountToPay <= 0) {
      callErrorToast('Invalid amount, please enter valid amount.')
      return
    }

    try {
      const response = await onChangePaymentStatus(invoice?.id)
      if (!response.ok) {
        callErrorToast(response.data)
      } else {
        callSuccessToast(
          `You recorded payment for INV-${invoice?.invoiceNumber}`
        )
        router.refresh()
        setPending(false)
        onClosePaymentDialog()
        return
      }
    } catch (err) {
      callErrorToast('Something went wrong, please try again.')
    }
    setPending(false)
  }

  useEffect(() => {
    setAmountToPay(invoice?.dueAmount || '')
    setPaymnetDate(new Date())
    setPaymentType(paymentOption[0].value)
  }, [invoice])

  return (
    <DialogContent className='bg-white dark:bg-zinc-950 dark:border-zinc-800 border-zinc-200 max-w-2xl shadow-sm sm:max-w-[575px] '>
      <div className='flex justify-between items-end'>
        <div>
          <h1 className='text-xl font-bold mb-0.5'>
            Record Payment for{' '}
            <span className='text-sky-500'>INV-{invoice?.invoiceNumber}</span>
          </h1>
          <div className='flex items-center gap-0.5 text-zinc-900/50 dark:text-white/50 text-[11px] font-semibold'>
            <p>Created on {formatDate(invoice?.dateIssue)}</p>
            <Dot size={16} strokeWidth={5} className='text-zinc-500/40' />
            <p>Due on {formatDate(invoice?.dueDate)}</p>
          </div>
        </div>
        <h1 className='text-xl font-bold'>
          {formatAmount(invoice?.dueAmount || 0)}
        </h1>
      </div>
      <Separator className='dark:bg-zinc-700/60 bg-zinc-300/60' />
      <div className='grid gap-4'>
        <div className='grid w-full items-center gap-1.5'>
          <Label htmlFor='amt' className='pl-1'>
            Amount to be Recorded
          </Label>
          <div className='relative'>
            <IndianRupee
              className='absolute left-3 top-1/2 -translate-y-1/2'
              size={12}
              strokeWidth={2}
            />
            <Input
              value={amountToPay}
              className={`border-[1px] text-xs font-medium outline-none bg-transparent ${
                +amountToPay > 0 &&
                +amountToPay <= (invoice?.dueAmount ?? Math.max())
                  ? 'dark:border-zinc-700 border-zinc-200'
                  : 'dark:border-red-600 border-red-400 focus-visible:ring-red-500'
              } pl-9`}
              onChange={(e) => {
                setAmountToPay(e.target.value)
              }}
              type='number'
              id='amt'
              placeholder='Enter amount to be recorded'
            />
          </div>
        </div>
        <div className='flex items-start'>
          <div className='grid w-1/2 items-center gap-1.5'>
            <Label htmlFor='payment-date' className='pl-1'>
              Payment Date
            </Label>
            <DatePicker
              key='payment-date'
              className='text-xs'
              date={paymentDate}
              setDate={setPaymnetDate}
              disabled
            />
          </div>
          <div className='grid w-1/2 items-center gap-2'>
            <Label htmlFor='payment-option' className='pl-1'>
              Payment Type
            </Label>
            <CustomRadioGroup
              value={paymentType}
              setValue={setPaymentType}
              options={paymentOption}
              className='text-xs'
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={isPending}
          className='bg-green-500/10 text-green-500 hover:text-green-600 hover:dark:text-green-400 hover:bg-green-500/20 border-green-300 border'
          onClick={onRecordPayment}
        >
          {isPending && <Loader size={18} className='animate-spin mr-1.5' />}
          Record Payment
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
