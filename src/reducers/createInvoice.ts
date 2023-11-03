import {
  CustomerInfoAction,
  CustomerInfoState,
  InvoiceInfoAction,
  InvoiceInfoState
} from '@/types/invoice'

export const customerInfoInitialState: CustomerInfoState = {
  email: '',
  whatsappNumber: '',
  city: '',
  pincode: '',
  state: '',
  country: ''
}

export const InvoiceInfoInitialState: InvoiceInfoState = {
  invoiceNumber: '',
  dateIssue: '',
  dueDate: '',
  sendingMethod: ''
}

export const customerInfoReducers = (
  state: CustomerInfoState,
  action: CustomerInfoAction
) => {
  switch (action.type) {
    case 'CUSTOMER_EMAIL':
      return {
        ...state,
        email: action.payload
      }
    case 'CUSTOMER_WHATSAPP_NUMBER':
      return {
        ...state,
        whatsappNumber: action.payload
      }
    case 'CUSTOMER_CITY':
      return {
        ...state,
        city: action.payload
      }
    case 'CUSTOMER_PINCODE':
      return {
        ...state,
        pincode: action.payload
      }
    case 'CUSTOMER_STATE':
      return {
        ...state,
        state: action.payload
      }
    case 'CUSTOMER_COUNTRY':
      return {
        ...state,
        country: action.payload
      }
    default:
      return state
  }
}

export const invoiceInfoReducers = (
  state: InvoiceInfoState,
  action: InvoiceInfoAction
) => {
  switch (action.type) {
    case 'INVOICE_NUMBER':
      return {
        ...state,
        invoiceNumber: action.payload
      }
    case 'INVOICE_DATE_ISSUE':
      return {
        ...state,
        dateIssue: action.payload
      }
    case 'INVOICE_DUE_DATE':
      return {
        ...state,
        dueDate: action.payload
      }
    case 'INVOICE_SENDING_METHOD':
      return {
        ...state,
        sendingMethod: action.payload
      }
    default:
      return state
  }
}
