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

export type CustomerInfoAction = {
  type: string
  payload: string
}

export type InvoiceInfoState = {
  invoiceNumber: string
  dateIssue: string
  dueDate: string
  sendingMethod: string
}

export type InvoiceInfoAction = {
  type: string
  payload: string
}

export type MenuOptions = {
  value: string
  label: string
}
