import {
  CustomerInfoState,
  InvoiceBody,
  InvoiceInfoState,
  ItemsInfoState,
  PaymentInfoState,
  PaymentMethods,
  PaymentStatus,
  PaymentTerms,
  SendMethods
} from '@/types/invoice'
import { OrganizationBody, OrganizationState } from '@/types/organization'
import { ToWords } from 'to-words'
import { toast } from 'sonner'
import { InstantInvoice, InstantInvoiceItems } from '@/types/instant'
export const formatAmount = (amount: number) => {
  const formattedNumber = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2
  })
  return '₹ ' + formattedNumber
}

export const callInfoToast = (info: string) => {
  toast.info(info, {
    position: 'top-right'
  })
}

export const callErrorToast = (info: string) => {
  toast.error(info, {
    position: 'top-right'
  })
}

export const callLoadingToast = (info: string) => {
  const loadingToastId = toast.loading(info, {
    position: 'top-right'
  })
  return loadingToastId
}

export const callSuccessToast = (info: string) => {
  toast.success(info, {
    position: 'top-right'
  })
}

export const dismissToast = (id: string) => {
  toast.dismiss(id)
}

export const formatTexttoCaps = (text: string) => {
  const firstChar = text[0].toLocaleUpperCase()
  const splittedText = text.slice(1)
  return firstChar + splittedText
}

export const formatDate = (inputDate: Date | undefined) => {
  if (!inputDate) {
    return '-'
  }
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const date = new Date(inputDate)
  const day = date.getDate()
  const monthAbbreviation = months[date.getMonth()]
  const year = date.getFullYear() % 100 // Get last two digits of the year

  const formattedDate = `${day
    .toString()
    .padStart(2, '0')} ${monthAbbreviation} '${year
    .toString()
    .padStart(2, '0')}`
  return formattedDate
}

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: ''
      }
    }
  }
})

export const numTowords = new ToWords()

export const formatInvoiceData = (
  customerInfoState: CustomerInfoState,
  customerLegalName: string,
  invoiceInfoState: InvoiceInfoState,
  paymentInfoState: PaymentInfoState,
  itemsInfoState: ItemsInfoState,
  subTotal: number
) => {
  const formattedInvoiceItems = itemsInfoState.map((item) => {
    return {
      id: item.id,
      name: item.name,
      quantity: +item.quantity,
      price: +item.price,
      total: item.total
    }
  })
  const formattedData: InvoiceBody = {
    customerInfo: JSON.stringify({
      ...customerInfoState,
      customerLegalName
    }),
    dateIssue: invoiceInfoState.dateIssue!,
    dueDate: invoiceInfoState.dueDate!,
    invoiceNumber: +invoiceInfoState.invoiceNumber!,
    notes: paymentInfoState.notes,
    shippingCharge: +paymentInfoState.shippingCharge,
    adjustmentFee: +paymentInfoState.adjustmentFee,
    sendingMethod:
      invoiceInfoState.sendingMethod === 'mail'
        ? SendMethods.MAIL
        : SendMethods.WHATSAPP,
    paymentMethod:
      paymentInfoState.method === 'cash'
        ? PaymentMethods.CASH
        : PaymentMethods.DIGITAL_WALLET,
    paymentStatus:
      paymentInfoState.status === 'paid'
        ? PaymentStatus.PAID
        : paymentInfoState.status === 'due'
        ? PaymentStatus.DUE
        : paymentInfoState.status === 'overdue'
        ? PaymentStatus.OVERDUE
        : PaymentStatus.PARTIALLY_PAID,
    paymentTerms:
      paymentInfoState.terms === 'immediate'
        ? PaymentTerms.IMMEDIATE
        : paymentInfoState.terms === 'net 15'
        ? PaymentTerms.NET_15
        : paymentInfoState.terms === 'net 30'
        ? PaymentTerms.NET_30
        : paymentInfoState.terms === 'net 60'
        ? PaymentTerms.NET_60
        : paymentInfoState.terms === 'net 90'
        ? PaymentTerms.NET_90
        : PaymentTerms.CUSTOM,
    invoiceTotal: subTotal + +paymentInfoState.adjustmentFee, // Todo: add discount
    subTotal: subTotal,
    totalAmount: subTotal + +paymentInfoState.adjustmentFee, // Todo: add shipping charge, packaging charge and discount
    dueAmount:
      paymentInfoState.status === 'paid'
        ? 0
        : subTotal + +paymentInfoState.adjustmentFee, // Todo: do it in server side instead in client side
    items: formattedInvoiceItems
  }
  return formattedData
}

export const formatCustomerInfo = (customerInfo: string) => {
  const info = JSON.parse(customerInfo)
  return info?.customerLegalName?.value || '-'
}

export const formatOrgData = (orgInfo: OrganizationState) => {
  const formattedData: OrganizationBody = {
    orgName: orgInfo.orgName!,
    whatsApp: orgInfo.whatsApp,
    email: orgInfo.email,
    businessType: orgInfo.businessType,
    website: orgInfo.website,
    pan: orgInfo.pan,
    gstin: orgInfo.gstin,
    businessRegistrationNumber: orgInfo.businessRegistrationNumber,
    address: JSON.stringify({
      city: orgInfo.city,
      pincode: orgInfo.pincode,
      state: orgInfo.state,
      country: orgInfo.country
    })
  }
  return formattedData
}

export const formatInstantInvoiceData = (
  instantInvoiceDetails: InstantInvoice,
  dueDate: Date,
  instantInvoiceItems: InstantInvoiceItems,
  paymentMethod: string,
  paymentTerm: string,
  sendingMethod: string,
  blobUrl: string
) => {
  const formattedInvoiceItems = JSON.parse(
    JSON.stringify(instantInvoiceItems)
  ).map(
    (item: {
      id: string
      name: string
      quantity: number
      price: number
      total: number | string
    }) => {
      return {
        id: item.id,
        name: item.name,
        quantity: +item.quantity,
        price: +item.price,
        total: item.total
      }
    }
  )
  const formattedData: InvoiceBody = {
    customerInfo: JSON.stringify({
      email: instantInvoiceDetails.email,
      whatsappNumber: instantInvoiceDetails.whatsappNumber,
      customerLegalName: {
        id: null,
        value: instantInvoiceDetails.customerName
      }
    }),
    dateIssue: instantInvoiceDetails.dateIssue!,
    dueDate: dueDate,
    invoiceNumber: +instantInvoiceDetails.invoiceNumber!,
    instantInvoiceLink: blobUrl,
    notes: '-',
    shippingCharge: 0,
    adjustmentFee: 0,
    sendingMethod:
      sendingMethod === 'mail' ? SendMethods.MAIL : SendMethods.WHATSAPP,
    paymentMethod:
      paymentMethod === 'cash'
        ? PaymentMethods.CASH
        : PaymentMethods.DIGITAL_WALLET,
    paymentStatus: PaymentStatus.DUE,
    paymentTerms:
      paymentTerm === 'immediate'
        ? PaymentTerms.IMMEDIATE
        : PaymentTerms.CUSTOM,
    invoiceTotal: +instantInvoiceDetails.invoiceTotal!, // Todo: add discount
    subTotal: +instantInvoiceDetails.invoiceTotal!,
    totalAmount: +instantInvoiceDetails.invoiceTotal!, // Todo: add shipping charge, packaging charge and discount
    dueAmount: +instantInvoiceDetails.invoiceTotal!,
    items: formattedInvoiceItems
  }
  return formattedData
}

export const checkOnDemandValidation = (
  instantInvoiceDetails: InstantInvoice,
  dueDate: Date | undefined,
  instantInvoiceItems: InstantInvoiceItems,
  paymentMethod: string,
  paymentTerm: string,
  sendingMethod: string,
  blobUrl: string | null
) => {
  if (!blobUrl) {
    toast.error(
      'Please re-upload your manual invoice to level up your experience 🌟',
      {
        position: 'bottom-center'
      }
    )
    return false
  }
  if (!instantInvoiceDetails.invoiceNumber) {
    toast.error('Please re-upload, we did not catch invoice number', {
      position: 'bottom-center'
    })
    return false
  }
  if (
    !instantInvoiceDetails.customerName ||
    !instantInvoiceDetails.invoiceTotal ||
    !instantInvoiceDetails.dateIssue
  ) {
    toast.error('Please fill invoice total and customer name', {
      position: 'bottom-center'
    })
    return false
  }
  if (!dueDate || !paymentMethod || !paymentTerm || !sendingMethod) {
    toast.error('Please validate invoice details', {
      position: 'bottom-center'
    })
    return false
  }

  if (sendingMethod === 'mail' && !instantInvoiceDetails.email) {
    toast.error('Please fill customer email', {
      position: 'bottom-center'
    })
    return false
  }

  if (sendingMethod === 'whatsapp' && !instantInvoiceDetails.whatsappNumber) {
    toast.error('Please fill customer whatsapp number', {
      position: 'bottom-center'
    })
    return false
  }

  return true
}
