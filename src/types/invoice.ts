import { AuditTrail } from '@prisma/client'

export type Option = {
  id: number
  value: string
}

export interface CustomerInfoState {
  email: string | null
  whatsappNumber: string | number | null
  city: string | null
  pincode: string | number | null
  state: string | null
  country: string | null
}

export interface CustomerInfoAction {
  type: string
  payload: object
}

export type ItemsInfoState = {
  id: string
  name: string
  quantity: number | string
  price: number | string
  total: number
}[]

export type ItemsInfoAction = {
  type: string
  payload: {
    index: number
    value: string | number
  }
}

export type InvoiceInfoState = {
  invoiceNumber: string | null
  dateIssue: Date | undefined
  dueDate: Date | undefined
  sendingMethod: string
}

export type InvoiceInfoAction = {
  type: string
  payload: object
}

export type PaymentInfoState = {
  terms: string // May me change to obj
  method: string // May me change to obj
  status: string // May me change to obj
  notes: string
  discount: number | string
  tax: number // will calculate based on tax %(from db)
  shippingCharge: number | string
  adjustmentFee: number | string
}

export type PaymentInfoAction = {
  type: string
  payload: object
}

export type MenuOptions = {
  value: string
  label: string
}

export type InvoiceBody = {
  customerInfo: string
  dateIssue: Date
  dueDate: Date
  invoiceNumber: number
  instantInvoiceLink?: string
  notes: string
  shippingCharge: number
  adjustmentFee: number
  sendingMethod: SendMethods
  paymentMethod: PaymentMethods
  paymentStatus: PaymentStatus
  paymentTerms: PaymentTerms
  subTotal: number
  invoiceTotal: number
  totalAmount: number
  dueAmount: number
  items: InvoiceItemBody[] // Todo: methods, status .. types will be enum
  approvalStatus?: InvoiceApprovalStatus
  receiptSendStatus?: ReceiptSendStatus
  auditTrailEntries?: AuditTrail[]
}

export type InvoiceAuditTrail = AuditTrail[]

export type InvoiceItemBody = {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

export enum InvoiceApprovalStatus {
  UNAPPROVED = 'UNAPPROVED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ReceiptSendStatus {
  SENT = 'SENT',
  NOT_SENT = 'NOT_SENT',
  FAILED = 'FAILED'
}

export enum SendMethods {
  MAIL = 'MAIL',
  WHATSAPP = 'WHATSAPP'
}

export enum PaymentStatus {
  PAID = 'PAID',
  DUE = 'DUE',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE'
}

export enum PaymentMethods {
  CASH = 'CASH',
  DIGITAL_WALLET = 'DIGITAL_WALLET'
}

export enum PaymentTerms {
  IMMEDIATE = 'IMMEDIATE',
  NET_15 = 'NET_15',
  NET_30 = 'NET_30',
  NET_60 = 'NET_60',
  NET_90 = 'NET_90',
  CUSTOM = 'CUSTOM'
}

export type InvoicesResponse = {
  customerInfo: string
  dateIssue: Date
  dueAmount: number
  dueDate: Date
  id: string
  invoiceNumber: number
  paymentStatus: 'PAID' | 'DUE' | 'PARTIALLY_PAID' | 'OVERDUE'
  totalAmount: number
}

export type InvoicesOverview = {
  totalCountAllTime: {
    paid: number | null
    due: number | null
    overdue: number | null
    partiallyPaid: number | null
  }
  totalCountCurrentWeek: {
    paid: number | null
    due: number | null
    overdue: number | null
    partiallyPaid: number | null
  }
  totalCountPreviousWeek: {
    paid: number | null
    due: number | null
    overdue: number | null
    partiallyPaid: number | null
  }
  percentageChange: {
    paid: number | null
    due: number | null
    overdue: number | null
    partiallyPaid: number | null
  }
}
