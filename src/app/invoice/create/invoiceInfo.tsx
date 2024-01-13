import InputDate from '@/components/input-date'
import InputPullback from '@/components/inputPullback'
import { SelectMenu } from '@/components/selectMenu'
import { useInvoiceContext } from '@/context/invoice'
import { SetStateAction, useEffect } from 'react'

const InvoiceInfo = () => {
  const { invoiceInfoState, invoiceInfoDispatch, paymentInfoDispatch } =
    useInvoiceContext()

  useEffect(() => {
    const getLastInvoiceNumber = async () => {
      const response = await fetch('/api/invoice/last')
      const lastInvNumber = await response.json()
      if (!lastInvNumber.ok) {
        return
      }
      invoiceInfoDispatch({
        type: 'INVOICE_NUMBER',
        payload: { invoiceNumber: lastInvNumber?.data?.invoiceNumber + 1 || 1 }
      })
    }
    getLastInvoiceNumber()
  }, [])

  useEffect(() => {
    invoiceInfoDispatch({
      type: 'INVOICE_DUE_DATE',
      payload: { dueDate: new Date() }
    })
    invoiceInfoDispatch({
      type: 'INVOICE_DATE_ISSUE',
      payload: { dateIssue: new Date() }
    })
  }, [])
  const sendingInvoiceOptions = [
    { value: 'mail', label: 'Mail' },
    { value: 'whatsapp', label: 'Whatsapp' }
  ] // Todo: CONSTANTS or BACKEND

  const onChangeInvoiceNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    invoiceInfoDispatch({
      type: 'INVOICE_NUMBER',
      payload: { invoiceNumber: e.target.value }
    })
  }

  const onChangeInvoiceDueDate = (value: SetStateAction<Date | undefined>) => {
    invoiceInfoDispatch({
      type: 'INVOICE_DUE_DATE',
      payload: { dueDate: value }
    })
    paymentInfoDispatch({
      type: 'PAYMENT_TERMS',
      payload: { terms: 'custom' }
    })
  }

  const onChangeInvoiceDateIssue = (
    value: SetStateAction<Date | undefined>
  ) => {
    invoiceInfoDispatch({
      type: 'INVOICE_DATE_ISSUE',
      payload: { dateIssue: value }
    })
    paymentInfoDispatch({
      type: 'PAYMENT_TERMS',
      payload: { terms: 'custom' }
    })
  }

  const onSetMethod = (value: any) => {
    invoiceInfoDispatch({
      type: 'INVOICE_SENDING_METHOD',
      payload: { sendingMethod: value }
    })
  }

  return (
    <>
      <h3 className='text-lg'>Invoice info</h3>
      <div className='flex justify-between mt-2 items-center'>
        <div className='w-[calc(60%-8rem)]'>
          <InputPullback
            value={invoiceInfoState.invoiceNumber}
            type='number'
            onChange={onChangeInvoiceNumber}
            placeholder='Invoice Number #'
          />
        </div>
        <div className='w-32'>
          <SelectMenu
            value={invoiceInfoState.sendingMethod}
            setValue={onSetMethod}
            options={sendingInvoiceOptions}
            label='Send via'
          />
        </div>
        <div className='w-1/6'>
          <InputDate
            value={invoiceInfoState.dateIssue}
            onChange={onChangeInvoiceDateIssue}
            placeholder='Date Issue'
            disabled
          />
        </div>
        <div className='w-1/6'>
          <InputDate
            value={invoiceInfoState.dueDate}
            onChange={onChangeInvoiceDueDate}
            placeholder='Due Date'
          />
        </div>
      </div>
    </>
  )
}

export default InvoiceInfo
