export interface InstantInvoice {
  customerName: string | null
  dateIssue: Date | undefined
  dueDate: Date | undefined
  invoiceNumber: string | null
  subTotal: number | null
  invoiceTotal: number | null
  totalAmount: number | null
  email: string | null
  whatsappNumber: string | number | null
}

export type InstantInvoiceAction = {
  type: string
  payload: object
}

export type InstantInvoiceItems = {
  id: string
  name: string
  quantity: number | string
  price: number | string
}[]

export type InstantInvoiceItemsAction = {
  type: string
  payload: {
    index: number
    value: string | number
  }
}
