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
  payload: string
}

export type ItemsInfoState = {
  id: number
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
