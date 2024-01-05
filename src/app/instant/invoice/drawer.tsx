import { ShadcnCombobox } from '@/components/shadcn-combobox'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatAmount } from '@/lib/helpers'
import Image from 'next/image'
import { useEffect, useReducer, useState } from 'react'
import {
  PAYMENT_TERMS as termsOptions,
  SENDING_OPTIONS as sendingOptions,
  PAYMENT_OPTION as paymentOptions
} from '@/lib/constants'
import {
  InstantInvoiceProvider,
  useInstantInvoiceContext
} from '@/context/instant-invoice'
import {
  InitialInstantInvoiceDetails,
  instantInvoiceReducers
} from '@/reducers/createInstant'
import { toast } from 'sonner'

const InstantDrawer = ({ blobUrl }: { blobUrl: string | null }) => {
  const [paymentTerm, setPaymentTerm] = useState(termsOptions[0].value)
  const [sendingMethod, setSendingMethod] = useState(sendingOptions[0].value)
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].value)
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())
  const [instantInvoiceDetails, instantInvoiceDispatch] = useReducer(
    instantInvoiceReducers,
    InitialInstantInvoiceDetails
  )
  return (
    <InstantInvoiceProvider
      value={{
        paymentTerm,
        sendingMethod,
        paymentMethod,
        dueDate,
        instantInvoiceDetails,
        setPaymentMethod,
        setPaymentTerm,
        setSendingMethod,
        setDueDate,
        instantInvoiceDispatch
      }}
    >
      <Drawer open={blobUrl !== null} dismissible={false}>
        <DrawerContent>
          <div className='mx-auto w-full max-w-4xl min-h-[480px]'>
            <DrawerHeader>
              <DrawerTitle className='text-black text-2xl dark:text-white'>
                Create Instant Invoice
              </DrawerTitle>
              <DrawerDescription className='text-zinc-600 dark:text-zinc-400'>
                Validate and edit the invoice here.
              </DrawerDescription>
            </DrawerHeader>
            <div className='p-4 flex gap-4 justify-between items-center mt-2'>
              <InvoiceForm />
              <div className='h-60 min-w-[230px] overflow-scroll border rounded-lg dark:border-zinc-700 border-zinc-200'>
                {blobUrl && (
                  <Image
                    src={blobUrl}
                    blurDataURL={blobUrl}
                    width='0'
                    height='0'
                    sizes='100vw'
                    style={{ width: '230px', height: 'auto' }}
                    alt='alt'
                    placeholder='blur'
                  />
                )}
              </div>
            </div>
            <DrawerFooter className='mt-4 max-w-3xl mx-auto'>
              <Footer />
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </InstantInvoiceProvider>
  )
}

export default InstantDrawer

const InvoiceForm = () => {
  const {
    instantInvoiceDetails,
    instantInvoiceDispatch,
    sendingMethod,
    setSendingMethod,
    paymentMethod,
    setPaymentMethod,
    paymentTerm,
    setPaymentTerm,
    dueDate,
    setDueDate
  } = useInstantInvoiceContext()

  useEffect(() => {
    toast.info('Invalid while extracting invoice', {
      position: 'bottom-center'
    })
    instantInvoiceDispatch({
      type: 'DUE_ISSUE',
      payload: { dateIssue: new Date() }
    })
  }, [])

  return (
    <div className='w-[calc(100%-280px)] flex flex-col gap-4'>
      <div className='flex w-full items-center gap-4'>
        <Label
          className='text-sm font-normal text-sky-950 dark:text-white w-[130px] text-right'
          htmlFor='customer'
        >
          Customer
        </Label>
        <Input
          value={instantInvoiceDetails.customerName || ''}
          className={`max-w-xs border-[1px] outline-none bg-transparent ${
            instantInvoiceDetails.customerName
              ? 'dark:border-zinc-700 border-zinc-200'
              : 'dark:border-red-600 border-red-400 focus-visible:ring-red-500'
          }`}
          type='text'
          id='customer'
          onChange={(e) => {
            instantInvoiceDispatch({
              type: 'CUSTOMER_NAME',
              payload: { customerName: e.target.value }
            })
          }}
        />
      </div>
      <div className='flex w-full items-center gap-4'>
        <ShadcnCombobox
          options={sendingOptions}
          value={sendingMethod}
          setValue={setSendingMethod}
          placeholder='Select'
        />
        {sendingMethod === 'mail' ? (
          <Input
            value={instantInvoiceDetails.email || ''}
            className={`max-w-xs border-[1px] outline-none bg-transparent ${
              instantInvoiceDetails.email
                ? 'dark:border-zinc-700 border-zinc-200'
                : 'dark:border-red-600 border-red-400 focus-visible:ring-red-500'
            }`}
            onChange={(e) => {
              instantInvoiceDispatch({
                type: 'EMAIL',
                payload: { email: e.target.value }
              })
            }}
            type='text'
            id='mail'
          />
        ) : (
          <Input
            value={instantInvoiceDetails.whatsappNumber || ''}
            className={`max-w-xs border-[1px] outline-none bg-transparent ${
              instantInvoiceDetails.whatsappNumber
                ? 'dark:border-zinc-700 border-zinc-200'
                : 'dark:border-red-600 border-red-400 focus-visible:ring-red-500'
            }`}
            onChange={(e) => {
              instantInvoiceDispatch({
                type: 'WHATSAPP',
                payload: { whatsappNumber: e.target.value }
              })
            }}
            type='number'
            id='whatsapp'
          />
        )}
      </div>
      <div className='flex w-full items-center gap-4'>
        <Label
          className='text-sm font-normal text-sky-950 dark:text-white w-[130px] text-right'
          htmlFor='duedate'
        >
          Due Date
        </Label>
        <DatePicker date={dueDate} setDate={setDueDate} />
        <ShadcnCombobox
          options={termsOptions}
          value={paymentTerm}
          setValue={setPaymentTerm}
          placeholder='Select Terms'
        />
      </div>
      <div className='flex w-full items-center gap-4'>
        <Label
          className={`text-sm font-normal text-sky-950 dark:text-white w-[130px] text-right`}
          htmlFor='total'
        >
          Invoice Total
        </Label>
        <div className='relative'>
          <p className='absolute top-1/2 -translate-y-1/2 left-2 text-sky-950 dark:text-white'>
            ₹
          </p>
          <Input
            value={instantInvoiceDetails.invoiceTotal || ''}
            className={`max-w-52 pl-6 border-[1px] outline-none bg-transparent ${
              instantInvoiceDetails.invoiceTotal
                ? 'dark:border-zinc-700 border-zinc-200'
                : 'dark:border-red-600 border-red-400 focus-visible:ring-red-500'
            }`}
            onChange={(e) => {
              instantInvoiceDispatch({
                type: 'INVOICE_TOTAL',
                payload: {
                  invoiceTotal: e.target.value,
                  subTotal: e.target.value,
                  totalAmount: e.target.value
                }
              })
            }}
            type='number'
            id='total'
          />
        </div>
        <ShadcnCombobox
          options={paymentOptions}
          value={paymentMethod}
          setValue={setPaymentMethod}
          placeholder='Select Terms'
          disabled
        />
      </div>
    </div>
  )
}

const Footer = () => {
  const { instantInvoiceDetails } = useInstantInvoiceContext()

  const onCreateInstantInvoice = () => {
    toast.error('Invalid Invoice Data', {
      position: 'bottom-center'
    })
  }
  return (
    <div className='flex items-center justify-between w-full'>
      <div>
        <p className='text-xs text-zinc-400'>Net Payable Amount</p>
        <h1 className='text-2xl font-semibold'>
          {formatAmount(
            instantInvoiceDetails.totalAmount === null
              ? 0
              : +instantInvoiceDetails.totalAmount
          )}
        </h1>
      </div>
      <Button
        onClick={onCreateInstantInvoice}
        variant='default'
        className='bg-sky-600 text-white hover:bg-sky-700 h-11 rounded-full px-6'
      >
        Send
      </Button>
    </div>
  )
}
