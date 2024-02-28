import {
  InvoiceBody,
  InvoiceInfoState,
  ItemsInfoState,
  Option,
  PaymentInfoState,
  PaymentMethods,
  PaymentStatus,
  PaymentTerms,
  SendMethods
} from '@/types/invoice'
import { OrganizationBody, OrganizationState } from '@/types/organization'
import { toast } from 'sonner'
import { InstantInvoice, InstantInvoiceItems } from '@/types/instant'

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

export const formatInvoiceData = (
  customerId: string,
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
    customerId: customerId,
    dateIssue: invoiceInfoState.dateIssue!,
    dueDate: invoiceInfoState.dueDate!,
    invoiceNumber: +invoiceInfoState.invoiceNumber!,
    notes: paymentInfoState.notes,
    shippingCharge: +paymentInfoState.shippingCharge,
    packagingCharge: +paymentInfoState.packagingCharge,
    adjustmentFee: +paymentInfoState.adjustmentFee,
    discount: +paymentInfoState.discount,
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
    invoiceTotal:
      subTotal +
      +paymentInfoState.adjustmentFee -
      subTotal * (+paymentInfoState.discount / 100),
    subTotal: subTotal,
    totalAmount:
      subTotal +
      +paymentInfoState.adjustmentFee +
      +paymentInfoState.additionalCharges -
      subTotal * (+paymentInfoState.discount / 100),
    dueAmount:
      paymentInfoState.status === 'paid'
        ? 0
        : subTotal +
          +paymentInfoState.adjustmentFee +
          +paymentInfoState.additionalCharges -
          subTotal * (+paymentInfoState.discount / 100),
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
  customerId: string,
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
    customerId: customerId,
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
  customerId: string | undefined,
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
  if (!customerId) {
    toast.error('Please enter valid customer', {
      position: 'bottom-center'
    })
    return false
  }
  if (!instantInvoiceDetails.invoiceNumber) {
    toast.error('Please re-upload, we did not catch invoice number', {
      position: 'bottom-center'
    })
    return false
  }
  if (!instantInvoiceDetails.invoiceTotal || !instantInvoiceDetails.dateIssue) {
    toast.error('Please fill invoice total and dateIssue', {
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

  return true
}
