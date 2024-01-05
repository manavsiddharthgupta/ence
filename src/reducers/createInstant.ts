import { InstantInvoice, InstantInvoiceAction } from '@/types/instant'

export const InitialInstantInvoiceDetails: InstantInvoice = {
  customerName: null,
  dueDate: undefined,
  dateIssue: undefined,
  invoiceNumber: null,
  invoiceTotal: null,
  subTotal: null,
  totalAmount: null,
  email: null,
  whatsappNumber: null
}

export const instantInvoiceReducers = (
  state: InstantInvoice,
  action: InstantInvoiceAction
) => {
  switch (action.type) {
    case 'CUSTOMER_NAME':
      return {
        ...state,
        ...action.payload
      }
    case 'DUE_DATE':
      return {
        ...state,
        ...action.payload
      }
    case 'DUE_ISSUE':
      return {
        ...state,
        ...action.payload
      }
    case 'INVOICE_NUMBER':
      return {
        ...state,
        ...action.payload
      }
    case 'INVOICE_TOTAL':
      return {
        ...state,
        ...action.payload
      }
    case 'EMAIL':
      return {
        ...state,
        ...action.payload
      }
    case 'WHATSAPP':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
