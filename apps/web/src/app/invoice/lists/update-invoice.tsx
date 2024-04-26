import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { InvoicesResponse, PaymentMethods, SendMethods } from '@/types/invoice'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatAmount, formatDate } from 'helper/format'
import { Dot, Loader, User2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z, ZodError } from 'zod'
import { DatePicker } from '@/components/ui/date-picker'
import { CustomRadioGroup } from '@/components/custom-radio-group'
import {
  PAYMENT_OPTION as paymentOption,
  SENDING_OPTIONS as sendingOption,
  APPROVAL_OPTIONS as approvalOption
} from '@/lib/constants'
import { Textarea } from '@/components/ui/textarea'
import { callErrorToast, callSuccessToast } from '@/lib/helpers'
import { useRouter } from 'next/navigation'
import { useOrgInfo } from '@/context/org-info'

const UpdateInvoiceDialog = ({
  invoice,
  onCloseUpdateInvoiceDialog
}: {
  invoice: InvoicesResponse | undefined
  onCloseUpdateInvoiceDialog: () => void
}) => {
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())
  const [isPending, setPending] = useState(false)
  const [paymentType, setPaymentType] = useState(paymentOption[0].value)
  const [sendingType, setSendingType] = useState(sendingOption[0].value)
  const [approvalStatus, setApprovalStatus] = useState(approvalOption[0].value)
  const [notes, setNotes] = useState('')
  const router = useRouter()
  const {
    orgInfo: { currency_type }
  } = useOrgInfo()
  useEffect(() => {
    if (
      !invoice?.dueDate ||
      !invoice?.sendingMethod ||
      !invoice?.approvalStatus ||
      !invoice?.paymentMethod ||
      !invoice?.notes
    ) {
      return
    }
    const date = new Date(invoice?.dueDate)
    const sendingMethod =
      invoice?.sendingMethod === SendMethods.MAIL
        ? sendingOption[0].value
        : sendingOption[1].value

    const approval =
      invoice?.approvalStatus === 'REJECTED'
        ? approvalOption[1].value
        : approvalOption[0].value

    const paymentMethod =
      invoice?.paymentMethod === PaymentMethods.CASH
        ? paymentOption[0].value
        : paymentOption[1].value
    setDueDate(new Date(date))
    setPaymentType(paymentMethod)
    setApprovalStatus(approval)
    setSendingType(sendingMethod)
    setNotes(invoice?.notes || '')
  }, [invoice])

  const onUpdateInvoice = async () => {
    setPending(true)
    try {
      dueDateSchema.parse(dueDate)
      paymentTypeSchema.parse(paymentType)
      sendingTypeSchema.parse(sendingType)
      approvalStatusSchema.parse(approvalStatus)
      notesSchema.parse(notes)

      const response = await fetch(`/api/invoice/${invoice?.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          dueDate,
          sendingMethod:
            sendingType === 'mail'
              ? 'MAIL'
              : sendingType === 'whatsapp'
              ? 'WHATSAPP'
              : null,
          paymentMethod:
            paymentType === 'cash'
              ? 'CASH'
              : paymentType === 'digital wallets'
              ? 'DIGITAL_WALLET'
              : null,
          approvalStatus:
            approvalStatus === 'approved'
              ? 'APPROVED'
              : approvalStatus === 'rejected'
              ? 'REJECTED'
              : null,
          oldStatus: invoice?.approvalStatus,
          notes
        })
      })
      const updtRes = await response.json()
      if (!updtRes.ok) {
        throw new Error(updtRes.data)
      } else {
        callSuccessToast('Successfully updated the invoice')
      }
      setPending(false)
      router.refresh()
      onCloseUpdateInvoiceDialog()
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessage = `Validation error: ${err.errors
          .map((e) => e.message)
          .join(', ')}`
        callErrorToast(errorMessage)
        console.error('Validation Error', errorMessage)
      } else {
        callErrorToast(`${err}`)
        console.error('Something Went Wrong', err)
      }
      setPending(false)
    }
  }
  return (
    <DialogContent className='bg-white dark:bg-zinc-950 dark:border-zinc-800 border-zinc-200 max-w-2xl shadow-sm sm:max-w-[575px] '>
      <div>
        <h1 className='text-xl font-bold mb-0.5'>
          Update Invoice{' '}
          <span className='text-sky-500'>INV-{invoice?.invoiceNumber}</span>
        </h1>
        <div className='flex items-center gap-0.5 text-zinc-900/50 dark:text-white/50 text-[11px] font-semibold'>
          <p>Created on {formatDate(invoice?.dateIssue)}</p>
          <Dot size={16} strokeWidth={5} className='text-zinc-500/40' />
          <p>{invoice?.paymentStatus}</p>
        </div>
      </div>
      <Separator className='dark:bg-zinc-700/60 bg-zinc-300/60' />
      <div className='grid gap-4'>
        <div className='flex items-start opacity-65'>
          <div className='grid w-1/2 items-center gap-1.5'>
            <Label htmlFor='Customer' className='pl-1'>
              Customer Info
            </Label>
            <div className='flex items-center gap-2 pl-1'>
              <Avatar className='w-5 h-5 bg-zinc-200/60 dark:bg-zinc-700/60 p-1'>
                <AvatarImage />
                <AvatarFallback>
                  <User2Icon size='16px' strokeWidth='1px' />
                </AvatarFallback>
              </Avatar>
              <span className='font-base text-xs w-[calc(100%-6)]'>
                {invoice?.customerInfo?.legalName || '-'}
              </span>
            </div>
          </div>
          <div className='grid w-1/2 items-center gap-1.5'>
            <Label htmlFor='total-amount' className='pl-1'>
              Total Amount
            </Label>
            <p className='font-base text-xs pl-1'>
              {formatAmount(invoice?.totalAmount || 0, currency_type)}
            </p>
          </div>
        </div>
        <div className='flex items-start'>
          <div className='grid w-1/2 items-center gap-1.5'>
            <Label htmlFor='due-date' className='pl-1'>
              Due Date
            </Label>
            <DatePicker
              key='due-date'
              className='text-xs'
              date={dueDate}
              setDate={setDueDate}
            />
          </div>
          <div className='grid w-1/2 items-center gap-2'>
            <Label htmlFor='payment-option' className='pl-1'>
              Payment Type
            </Label>
            <CustomRadioGroup
              disabled // -----> will change
              value={paymentType}
              setValue={setPaymentType}
              options={paymentOption}
              className='text-xs'
            />
          </div>
        </div>
        <div className='flex items-start'>
          {/* <div className='grid w-1/2 items-center gap-2'>
            <Label htmlFor='Sending' className='pl-1'>
              Sending Type
            </Label>
            <CustomRadioGroup
              value={sendingType}
              setValue={setSendingType}
              options={sendingOption}
              className='text-xs'
            />
          </div> */}
          <div className='grid w-1/2 items-center gap-2'>
            <Label htmlFor='Approval' className='pl-1 '>
              Approval Status
            </Label>
            <CustomRadioGroup
              disabled={invoice?.approvalStatus === 'APPROVED'}
              value={approvalStatus}
              setValue={setApprovalStatus}
              options={approvalOption}
              className='text-xs'
            />
          </div>
        </div>
        <div className='grid w-full items-center gap-1.5'>
          <Label htmlFor='notes' className='pl-1'>
            Notes
          </Label>
          <Textarea
            value={notes}
            className='text-xs max-h-3 dark:bg-transparent dark:border-zinc-800 border-[1px]'
            onChange={(e) => {
              setNotes(e.target.value)
            }}
            placeholder='Type your message here.'
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={isPending}
          className='rounded-full'
          onClick={onUpdateInvoice}
        >
          {isPending && <Loader size={18} className='animate-spin mr-1.5' />}
          Update
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default UpdateInvoiceDialog

const dueDateSchema = z.date()
const paymentTypeSchema = z.string()
const sendingTypeSchema = z.string()
const approvalStatusSchema = z.string()
const notesSchema = z.string()
