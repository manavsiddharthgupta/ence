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
import { Id, toast } from 'react-toastify'
import { ToWords } from 'to-words'

export const formatAmount = (amount: number) => {
  const formattedNumber = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2
  })
  return '₹ ' + formattedNumber
}

export const callInfoToast = (info: string) => {
  toast.info(info, {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem('theme') === 'Light' ? 'light' : 'dark'
  })
}

export const callErrorToast = (info: string) => {
  toast.error(info, {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem('theme') === 'Light' ? 'light' : 'dark'
  })
}

export const callLoadingToast = (info: string) => {
  const loadingToastId = toast.loading(info, {
    position: 'top-center',
    autoClose: false,
    theme: localStorage.getItem('theme') === 'Light' ? 'light' : 'dark'
  })
  return loadingToastId
}

export const callSuccessToast = (info: string) => {
  toast.success(info, {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem('theme') === 'Light' ? 'light' : 'dark'
  })
}

export const dismissToast = (id: Id) => {
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

  const formattedDate = `${day} ${monthAbbreviation} '${year
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
  const formattedIvoiceItems = itemsInfoState.map((item) => {
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
    totalAmount: subTotal + +paymentInfoState.shippingCharge,
    dueAmount:
      paymentInfoState.status === 'paid'
        ? 0
        : subTotal + +paymentInfoState.shippingCharge,
    items: formattedIvoiceItems
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
