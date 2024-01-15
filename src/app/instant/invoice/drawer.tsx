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
import {
  callLoadingToast,
  checkOnDemandValidation,
  formatAmount,
  formatInstantInvoiceData
} from '@/lib/helpers'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useReducer,
  useState
} from 'react'
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
import { Loader2Icon } from 'lucide-react'
import { ImageMagnifier } from '@/components/img-magnifier'

const InstantDrawer = ({
  blobUrl,
  onReset
}: {
  blobUrl: string | null
  onReset: () => void
}) => {
  const [loading, setLoadng] = useState(true)
  const [paymentTerm, setPaymentTerm] = useState(termsOptions[0].value)
  const [sendingMethod, setSendingMethod] = useState(sendingOptions[1].value)
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
            <div className='p-4 flex gap-4 justify-between items-center mt-2 relative'>
              {loading && (
                <div className='w-[calc(100%-320px)] absolute top-0 z-10 -left-5 bg-zinc-50/90 dark:bg-zinc-800/90 dark:text-white text-black h-full rounded-2xl flex justify-center items-center'>
                  <div className='w-fit h-fit flex items-center gap-2'>
                    <Loader2Icon className='animate-spin' />
                    <p className='text-sm font-semibold'>Scanning document</p>
                  </div>
                </div>
              )}
              <Carousel className='w-[calc(100%-320px)] z-0'>
                <InvoiceCarouselContent
                  blobUrl={blobUrl}
                  setLoading={setLoadng}
                />
                <CarouselPrevious className='dark:bg-zinc-800/30 hover:dark:bg-zinc-800/90 bg-zinc-100 hover:bg-zinc-200/80 dark:border-zinc-700 border-zinc-300' />
                <CarouselNext className='dark:bg-zinc-800/30 hover:dark:bg-zinc-800/90 bg-zinc-100 hover:bg-zinc-200/80 dark:border-zinc-700 border-zinc-300' />
              </Carousel>

              {blobUrl && (
                <ImageMagnifier
                  blobUrl={blobUrl}
                  width='230px'
                  height='240px'
                  magnifierHeight={120}
                  magnifieWidth={120}
                />
              )}
            </div>
            <DrawerFooter className='mt-4 max-w-4xl mx-auto'>
              <Footer
                blobUrl={blobUrl}
                onReset={onReset}
                isScanning={loading}
              />
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </InstantInvoiceProvider>
  )
}

export default InstantDrawer

const InvoiceCarouselContent = ({
  blobUrl,
  setLoading
}: {
  blobUrl: string | null
  setLoading: Dispatch<SetStateAction<boolean>>
}) => {
  const {
    instantInvoiceDispatch,
    instantInvoiceItemsDispatch,
    setPaymentTerm,
    setSendingMethod
  } = useInstantInvoiceContext()

  const getLastInvoiceNumber = useCallback(async () => {
    const response = await fetch('/api/invoice/last')
    const lastInvNumber = await response.json()
    if (!lastInvNumber.ok) {
      return
    }
    instantInvoiceDispatch({
      type: 'INVOICE_NUMBER',
      payload: { invoiceNumber: lastInvNumber?.data?.invoiceNumber + 1 || 1 }
    })
  }, [])

  useEffect(() => {
    if (!blobUrl) {
      setLoading(false)
      return
    }
    const getParserData = async () => {
      setLoading(true)
      const response = await fetch(`/api/scan/invoice?blobUrl=${blobUrl}`)
      const parsedData = await response.json()
      console.log(parsedData)

      if (!parsedData.ok) {
        toast.error('Invalid Invoice Format', {
          position: 'bottom-center'
        })
        instantInvoiceItemsDispatch({
          type: 'ADD_NEW_ITEM',
          payload: {
            index: 0,
            value: ''
          }
        })
        instantInvoiceDispatch({
          type: 'UPDATE',
          payload: {
            customerName: null,
            dateIssue: new Date(),
            invoiceTotal: null,
            subTotal: null,
            totalAmount: null,
            email: null,
            whatsappNumber: null
          }
        })
        setPaymentTerm('immediate')
        setSendingMethod('whatsapp')
      } else {
        instantInvoiceDispatch({
          type: 'UPDATE',
          payload: {
            customerName: parsedData?.data?.customer?.customerName || '',
            dateIssue: new Date(),
            invoiceTotal: parsedData?.data?.total || 0, // will change
            subTotal: parsedData?.data?.total || 0, // will change
            totalAmount: parsedData?.data?.total || 0, // will change
            email: parsedData?.data?.customer?.customerEmail || '',
            whatsappNumber: parsedData?.data?.customer?.customerNumber || ''
          }
        })
        instantInvoiceItemsDispatch({
          type: 'ADD_ITEMS',
          payload: {
            index: 0,
            value: '',
            items: parsedData?.data?.items.map((item: any) => {
              return {
                id: item.id,
                name: item.name || '',
                price: +item.price || 0,
                quantity: +item.quantity || 0,
                total: +item.total || 0
              }
            })
          }
        })
      }
      setLoading(false)
    }
    getParserData()
    getLastInvoiceNumber()
  }, [blobUrl])

  return (
    <CarouselContent>
      <CarouselItem key={1}>
        <InvoiceInfo />
      </CarouselItem>
      <CarouselItem key={2}>
        <InvoiceItems />
      </CarouselItem>
    </CarouselContent>
  )
}

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
    if (paymentTerm === 'immediate') {
      setDueDate(new Date())
    }
  }, [paymentTerm])

  useEffect(() => {
    if (dueDate?.toDateString() !== new Date().toDateString()) {
      setPaymentTerm('custom')
    }
  }, [dueDate])

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
          placeholder='Select Method'
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
    })
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
  onReset,
  isScanning
}: {
  blobUrl: string | null
  onReset: () => void
  isScanning: boolean
}) => {
  const [loading, setLoading] = useState(false)
  const {
    instantInvoiceDetails,
    dueDate,
    instantInvoiceItems,
    paymentMethod,
    paymentTerm,
    sendingMethod,
    instantInvoiceDispatch
  } = useInstantInvoiceContext()

  const onCreateInstantInvoice = async () => {
    const isValid = checkOnDemandValidation(
      instantInvoiceDetails,
      dueDate,
      instantInvoiceItems,
      paymentMethod,
      paymentTerm,
      sendingMethod,
      blobUrl
    )
    if (!isValid || !dueDate || !blobUrl) {
      return
    }

    const formattedData = formatInstantInvoiceData(
      instantInvoiceDetails,
      dueDate,
      instantInvoiceItems,
      paymentMethod,
      paymentTerm,
      sendingMethod,
      blobUrl
    )

    setLoading(true)
    const loadingToastId = callLoadingToast('Creating invoice...')
    const response = await fetch('/api/invoice/instant', {
      method: 'POST',
      body: JSON.stringify(formattedData)
    })
    const invRes = await response.json()
    if (invRes.ok) {
      toast.success('🎉 Invoice created successfully!', {
        id: loadingToastId
      })
      onReset()
      instantInvoiceDispatch({
        type: 'UPDATE',
        payload: {
          customerName: null,
          invoiceTotal: null,
          invoiceNumber: null,
          subTotal: null,
          totalAmount: null,
          email: null,
          whatsappNumber: null
        }
      })
    } else {
      setLoading(false)
      toast.error('Something went wrong while creating invoice', {
        id: loadingToastId
      })
    }
  }
  return (
    <div className='flex items-center justify-between w-full pr-4'>
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
      <div className='flex gap-6 items-center'>
        <Button
          type='button'
          variant='secondary'
          onClick={() => {
            onReset()
          }}
          className='dark:bg-zinc-900 dark:hover:bg-zinc-800/50 hover:bg-zinc-100 h-11 rounded-full px-6'
        >
          Cancel
        </Button>
        <Button
          onClick={onCreateInstantInvoice}
          disabled={loading || isScanning}
          variant='default'
          className='bg-sky-600 text-white hover:bg-sky-700 h-11 rounded-full px-6'
        >
          Send
        </Button>
      </div>
    </div>
  )
}
