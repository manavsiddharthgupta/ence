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
import { Dispatch, useEffect, useReducer, useState } from 'react'
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
  InitialInstantInvoiceItemsState,
  instantInvoiceItemsReducers,
  instantInvoiceReducers
} from '@/reducers/createInstant'
import { toast } from 'sonner'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { InstantInvoiceItemsAction } from '@/types/instant'

const InstantDrawer = ({
  blobUrl,
  onReset
}: {
  blobUrl: string | null
  onReset: () => void
}) => {
  const [paymentTerm, setPaymentTerm] = useState(termsOptions[0].value)
  const [sendingMethod, setSendingMethod] = useState(sendingOptions[0].value)
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].value)
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())
  const [instantInvoiceDetails, instantInvoiceDispatch] = useReducer(
    instantInvoiceReducers,
    InitialInstantInvoiceDetails
  )
  const [instantInvoiceItems, instantInvoiceItemsDispatch] = useReducer(
    instantInvoiceItemsReducers,
    InitialInstantInvoiceItemsState
  )

  return (
    <InstantInvoiceProvider
      value={{
        instantInvoiceItems,
        instantInvoiceItemsDispatch,
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
              <Carousel className='w-[calc(100%-320px)]'>
                <CarouselContent>
                  <CarouselItem key={1}>
                    <InvoiceInfo />
                  </CarouselItem>
                  <CarouselItem key={2}>
                    <InvoiceItems />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className='dark:bg-zinc-800/30 hover:dark:bg-zinc-800/90 bg-zinc-100 hover:bg-zinc-200/80 dark:border-zinc-700 border-zinc-300' />
                <CarouselNext className='dark:bg-zinc-800/30 hover:dark:bg-zinc-800/90 bg-zinc-100 hover:bg-zinc-200/80 dark:border-zinc-700 border-zinc-300' />
              </Carousel>
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
              <Footer blobUrl={blobUrl} onReset={onReset} />
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </InstantInvoiceProvider>
  )
}

export default InstantDrawer

const InvoiceInfo = () => {
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
    <div className='flex flex-col gap-4 py-2'>
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

const InvoiceItems = () => {
  const { instantInvoiceItems, instantInvoiceItemsDispatch } =
    useInstantInvoiceContext()

  useEffect(() => {
    instantInvoiceItemsDispatch({
      type: 'ADD_NEW_ITEM',
      payload: {
        index: instantInvoiceItems.length,
        value: ''
      }
    }) // will remove or update
  }, [])

  return (
    <div className='h-60 overflow-y-auto'>
      {instantInvoiceItems.map((item, index) => {
        return (
          <Item
            id={item.id}
            index={index}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            total={item.total}
            key={item.id}
            itemsInfoDispatch={instantInvoiceItemsDispatch}
          />
        )
      })}
    </div>
  )
}

const Item = ({
  id,
  index,
  name,
  price,
  quantity,
  total,
  itemsInfoDispatch
}: {
  id: string
  index: number
  name: string
  price: string | number
  quantity: string | number
  total: string | number
  itemsInfoDispatch: Dispatch<InstantInvoiceItemsAction>
}) => {
  const onChangeItemName = (e: React.ChangeEvent<HTMLInputElement>) => {
    itemsInfoDispatch({
      type: 'ITEM_NAME',
      payload: { index: index, value: e.target.value }
    })
  }

  const onChangeItemQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    itemsInfoDispatch({
      type: 'ITEM_QUANTITY',
      payload: { index: index, value: e.target.value }
    })
  }

  const onChangeItemPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    itemsInfoDispatch({
      type: 'ITEM_PRICE',
      payload: { index: index, value: e.target.value }
    })
  }

  return (
    <div className='flex mb-4 px-2 mt-2 justify-start gap-2 w-full items-center'>
      <div className='w-[13%]'>
        <Input
          value={quantity}
          type='number'
          onChange={onChangeItemQuantity}
          placeholder='Qty'
          className={`border-[1px] outline-none bg-transparent ${
            quantity
              ? 'dark:border-zinc-700 border-zinc-200'
              : 'dark:border-red-600 border-red-400 focus-visible:ring-red-500'
          }`}
        />
      </div>
      <div className='w-[40%]'>
        <Input
          value={name}
          type='text'
          onChange={onChangeItemName}
          placeholder='Item'
          className={`border-[1px] outline-none bg-transparent ${
            name
              ? 'dark:border-zinc-700 border-zinc-200'
              : 'dark:border-red-600 border-red-400 focus-visible:ring-red-500'
          }`}
        />
      </div>
      <div className='w-[18%]'>
        <Input
          value={price}
          type='number'
          onChange={onChangeItemPrice}
          placeholder='Price/Pcs'
          className={`border-[1px] outline-none bg-transparent ${
            price
              ? 'dark:border-zinc-700 border-zinc-200'
              : 'dark:border-red-600 border-red-400 focus-visible:ring-red-500'
          }`}
        />
      </div>
      <div className='w-[18%]'>
        <Input
          value={total}
          type='number'
          readOnly
          placeholder='Price/Pcs'
          className={`border-[1px] outline-none bg-transparent ${
            price
              ? 'dark:border-zinc-700 border-zinc-200'
              : 'dark:border-red-600 border-red-400 focus-visible:ring-red-500'
          }`}
        />
      </div>
    </div>
  )
}

const Footer = ({
  blobUrl,
  onReset
}: {
  blobUrl: string | null
  onReset: () => void
}) => {
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
      <div className='flex gap-2 items-center'>
        <Button
          type='button'
          variant='secondary'
          className='dark:bg-zinc-900 dark:hover:bg-zinc-800/50 dark:border-zinc-700 border-zinc-200 border hover:bg-zinc-100  h-11 rounded-full px-6'
        >
          Close
        </Button>
        <Button
          onClick={onCreateInstantInvoice}
          variant='default'
          className='bg-sky-600 text-white hover:bg-sky-700 h-11 rounded-full px-6'
        >
          Send
        </Button>
      </div>
    </div>
  )
}
