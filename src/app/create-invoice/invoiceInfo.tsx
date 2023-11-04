import InputPullback from '@/components/inputPullback'
import { SelectMenu } from '@/components/selectMenu'
import {
  InvoiceInfoInitialState,
  invoiceInfoReducers
} from '@/reducers/createInvoice'
import { useReducer } from 'react'

const InvoiceInfo = () => {
  const [invoiceInfoState, invoiceInfoDispatch] = useReducer(
    invoiceInfoReducers,
    InvoiceInfoInitialState
  )
  const sendingInvoiceOptions = [
    { value: 'mail', label: 'Mail' },
    { value: 'whatsapp', label: 'Whatsapp' },
    { value: 'inhand', label: 'In-hand' }
  ] // Todo: CONSTANTS or BACKEND

  console.log(invoiceInfoState) // Todo: Remove / testing

  const onChangeInvoiceNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    invoiceInfoDispatch({
      type: 'INVOICE_NUMBER',
      payload: { invoiceNumber: e.target.value }
    })
  }

  const onChangeInvoiceDueDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    invoiceInfoDispatch({
      type: 'INVOICE_DUE_DATE',
      payload: { dueDate: e.target.value }
    })
  }

  const onChangeInvoiceDateIssue = (e: React.ChangeEvent<HTMLInputElement>) => {
    invoiceInfoDispatch({
      type: 'INVOICE_DATE_ISSUE',
      payload: { dateIssue: e.target.value }
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
          <InputPullback
            value={invoiceInfoState.dateIssue}
            type='number'
            onChange={onChangeInvoiceDateIssue}
            placeholder='Date Issue'
          />
        </div>
        <div className='w-1/6'>
          <InputPullback
            value={invoiceInfoState.dueDate}
            type='number'
            onChange={onChangeInvoiceDueDate}
            placeholder='Due Date'
          />
        </div>
      </div>
    </>
  )
}

export default InvoiceInfo
