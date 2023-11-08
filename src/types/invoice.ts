export type Option = {
  id: number
  value: string
}

export interface CustomerInfoState {
  email: string
  whatsappNumber: string | number
  city: string
  pincode: string | number
  state: string
  country: string
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
  invoiceNumber: string
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
  gst: number | string
  tax: number // will calculate based on tax %(from db)
  shippingCharge: number | string
}

export type PaymentInfoAction = {
  type: string
  payload: object
}

export type MenuOptions = {
  value: string
  label: string
}
