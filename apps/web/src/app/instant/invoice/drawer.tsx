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
  checkOnDemandValidation,
  formatInstantInvoiceData
} from '@/lib/helpers'
import { CurrencyFormat, formatAmount } from 'helper/format'
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
import { InstantInvoiceItemsAction } from '@/types/instant'
import { ChevronLeft, ChevronRight, Loader2Icon } from 'lucide-react'
import { ImageMagnifier } from '@/components/img-magnifier'
import { motion } from 'framer-motion'
import { Option } from '@/types/invoice'
import InstantInputCombobox from './customer-input'
import { useOrgInfo } from '@/context/org-info'

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
  const [customerLegalName, setCustomerLegalName] = useState<Option | null>(
    null
  )
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())
  const [instantInvoiceDetails, instantInvoiceDispatch] = useReducer(
    instantInvoiceReducers,
    InitialInstantInvoiceDetails
  )
  const [instantInvoiceItems, instantInvoiceItemsDispatch] = useReducer(
    instantInvoiceItemsReducers,
    InitialInstantInvoiceItemsState
  )

  useEffect(() => {
    instantInvoiceDispatch({
      type: 'UPDATE',
      payload: {
        customerName: null,
        invoiceTotal: null,
        invoiceNumber: null,
        subTotal: null,
        email: null,
        whatsappNumber: null
      }
    })
    instantInvoiceItemsDispatch({
      type: 'ADD_NEW_ITEM',
      payload: {
        index: instantInvoiceItems.length,
        value: ''
      }
    })
    setCustomerLegalName(null)
  }, [blobUrl])

  return (
    <InstantInvoiceProvider
      value={{
        instantInvoiceItems,
        customerLegalName,
        instantInvoiceItemsDispatch,
        paymentTerm,
        sendingMethod,
        paymentMethod,
        dueDate,
        instantInvoiceDetails,
        setPaymentMethod,
        setCustomerLegalName,
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
                <div className='w-[calc(100%-320px)] absolute top-0 z-10 -left-5 bg-zinc-50/50 dark:bg-zinc-900/50 dark:text-white text-black h-full rounded-2xl flex justify-center items-center backdrop-blur-sm'>
                  <div className='w-fit h-fit flex items-center gap-2'>
                    <Loader2Icon className='animate-spin' />
                    <p className='text-sm font-semibold'>Scanning document</p>
                  </div>
                </div>
              )}
              <div className='w-[calc(100%-320px)] z-0 relative'>
                <InvoiceCarouselContent
                  blobUrl={blobUrl}
                  setLoading={setLoadng}
                  isScanning={loading}
                />
              </div>

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

const steps = [
  {
    id: 'Step 1',
    name: 'Invoice Info',
    fields: []
  },
  {
    id: 'Step 2',
    name: 'Items Info',
    fields: []
  }
]

const InvoiceCarouselContent = ({
  blobUrl,
  setLoading,
  isScanning
}: {
  blobUrl: string | null
  setLoading: Dispatch<SetStateAction<boolean>>
  isScanning: boolean
}) => {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const delta = currentStep - previousStep
  const {
    instantInvoiceDispatch,
    instantInvoiceItemsDispatch,
    setPaymentTerm,
    setSendingMethod
  } = useInstantInvoiceContext()

  const next = async () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
      }
      setPreviousStep(currentStep)
      setCurrentStep((step) => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep((step) => step - 1)
    }
  }

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
            subTotal: null
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
            invoiceTotal: +parsedData?.data?.total || 0, // will change
            subTotal: +parsedData?.data?.total || 0 // will change
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
    <>
      {currentStep === 0 && (
        <motion.div
          initial={{ x: delta >= 0 ? '30%' : '-30%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <InvoiceInfo />
        </motion.div>
      )}
      {currentStep === 1 && (
        <motion.div
          initial={{ x: delta >= 0 ? '30%' : '-30%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <InvoiceItems />
        </motion.div>
      )}
      <Button
        variant='outline'
        disabled={isScanning}
        onClick={next}
        className='w-8 h-8 p-0 text-zinc-900/70 dark:text-white/70 cursor-pointer rounded-full dark:bg-zinc-800/30 hover:dark:bg-zinc-800/90 bg-zinc-100 hover:bg-zinc-200/80 dark:border-zinc-700 border-zinc-300 absolute top-1/2 -right-10'
      >
        <ChevronRight size={16} />
      </Button>
      <Button
        variant='outline'
        disabled={isScanning}
        onClick={prev}
        className='w-8 h-8 p-0 text-zinc-900/70 dark:text-white/70 cursor-pointer rounded-full dark:bg-zinc-800/30 hover:dark:bg-zinc-800/90 bg-zinc-100 hover:bg-zinc-200/80 dark:border-zinc-700 border-zinc-300 absolute top-1/2 -left-20'
      >
        <ChevronLeft size={16} />
      </Button>
    </>
  )
}

const InvoiceInfo = () => {
  const {
    instantInvoiceDetails,
    instantInvoiceDispatch,
    customerLegalName,
    setCustomerLegalName,
    sendingMethod,
    setSendingMethod,
    paymentMethod,
    setPaymentMethod,
    paymentTerm,
    setPaymentTerm,
    dueDate,
    setDueDate
  } = useInstantInvoiceContext()
  const {
    orgInfo: { currency_type }
  } = useOrgInfo()

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
          className='text-sm font-normal text-sky-950 dark:text-white min-w-32 w-[130px] text-right'
          htmlFor='customer'
        >
          Customer
        </Label>
        <InstantInputCombobox
          selectedValue={customerLegalName}
          setSelectedValue={setCustomerLegalName}
          query={instantInvoiceDetails.customerName || ''}
          onSetQuery={instantInvoiceDispatch}
        />
      </div>
      <div className='flex w-full items-center gap-4'>
        <Label
          className={`text-sm font-normal text-sky-950 dark:text-white w-[130px] text-right`}
          htmlFor='total'
        >
          Invoice Number
        </Label>
        <Input
          value={instantInvoiceDetails.invoiceNumber || ''}
          className={`max-w-48 border-[1px] outline-none bg-transparent  ${
            instantInvoiceDetails.invoiceNumber
              ? 'dark:border-zinc-700 border-zinc-200'
              : 'dark:border-red-600 border-red-400 focus-visible:ring-red-500'
          }`}
          disabled
          type='number'
          id='inv-number'
        />
        {/* <ShadcnCombobox
          options={sendingOptions}
          value={sendingMethod}
          setValue={setSendingMethod}
          placeholder='Select'
        /> */}
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
            {currency_type === '☒' ? '☒' : CurrencyFormat[currency_type].symbol}
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
                  subTotal: e.target.value
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

  return (
    <div className='h-56 overflow-y-auto'>
      <div className='flex mb-4 px-2 mt-2 justify-start gap-2 w-full items-center'>
        <div className='w-[13%]'>
          <p className='text-xs font-normal pl-2 text-zinc-900/40 dark:text-white/30'>
            Qty
          </p>
        </div>
        <div className='w-[40%]'>
          <p className='text-xs font-normal pl-2 text-zinc-900/40 dark:text-white/30'>
            Items
          </p>
        </div>
        <div className='w-[18%]'>
          <p className='text-xs font-normal pl-2 text-zinc-900/40 dark:text-white/30'>
            Price
          </p>
        </div>
        <div className='w-[18%]'>
          <p className='text-xs font-normal pl-2 text-zinc-900/40 dark:text-white/30'>
            Total
          </p>
        </div>
      </div>
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
    customerLegalName,
    paymentMethod,
    paymentTerm,
    sendingMethod
  } = useInstantInvoiceContext()
  const {
    orgInfo: { currency_type }
  } = useOrgInfo()

  const onCreateInstantInvoice = async () => {
    const isValid = checkOnDemandValidation(
      customerLegalName?.id,
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
      customerLegalName?.id!,
      instantInvoiceDetails,
      dueDate,
      instantInvoiceItems,
      paymentMethod,
      paymentTerm,
      sendingMethod,
      blobUrl
    )

    setLoading(true)
    const loadingToastId = toast.loading('Creating invoice...', {
      position: 'bottom-center'
    })
    const response = await fetch('/api/invoice/instant', {
      method: 'POST',
      body: JSON.stringify(formattedData)
    })
    const invRes = await response.json()
    if (invRes.ok) {
      toast.success('🎉 Invoice created successfully!', {
        id: loadingToastId,
        position: 'bottom-center'
      })
      onReset()
    } else {
      setLoading(false)
      toast.error('Something went wrong while creating invoice', {
        id: loadingToastId,
        position: 'bottom-center'
      })
    }
  }
  return (
    <div className='flex items-center justify-between w-full pr-4'>
      <div>
        <p className='text-xs text-zinc-400'>Net Payable Amount</p>
        <h1 className='text-2xl font-semibold'>
          {formatAmount(
            instantInvoiceDetails.invoiceTotal === null
              ? 0
              : +instantInvoiceDetails.invoiceTotal,
            currency_type
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
