import {
  CustomerInfoAction,
  CustomerInfoState,
  InvoiceInfoAction,
  InvoiceInfoState,
  ItemsInfoAction,
  ItemsInfoState,
  PaymentInfoAction,
  PaymentInfoState
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

export const ItemsInfoInitialState: ItemsInfoState = [
  {
    id: 0,
    name: '',
    price: '',
    quantity: '',
    total: 0
  }
]

export const PaymentInfoInitailState: PaymentInfoState = {
  terms: '',
  status: '',
  method: '',
  gst: '0',
  notes: '',
  tax: 0,
  shippingCharge: '0'
}

export const customerInfoReducers = (
  state: CustomerInfoState,
  action: CustomerInfoAction
) => {
  switch (action.type) {
    case 'CUSTOMER_EMAIL':
      return {
        ...state,
        ...action.payload
      }
    case 'CUSTOMER_WHATSAPP_NUMBER':
      return {
        ...state,
        ...action.payload
      }
    case 'CUSTOMER_CITY':
      return {
        ...state,
        ...action.payload
      }
    case 'CUSTOMER_PINCODE':
      return {
        ...state,
        ...action.payload
      }
    case 'CUSTOMER_STATE':
      return {
        ...state,
        ...action.payload
      }
    case 'CUSTOMER_COUNTRY':
      return {
        ...state,
        ...action.payload
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
        ...action.payload
      }
    case 'INVOICE_DATE_ISSUE':
      return {
        ...state,
        ...action.payload
      }
    case 'INVOICE_DUE_DATE':
      return {
        ...state,
        ...action.payload
      }
    case 'INVOICE_SENDING_METHOD':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export const itemsInfoReducers = (
  state: ItemsInfoState,
  action: ItemsInfoAction
) => {
  switch (action.type) {
    case 'ITEM_NAME':
      state[action.payload.index].name = action.payload.value + ''
      return [...state]

    case 'ITEM_PRICE':
      state[action.payload.index].price = action.payload.value
      state[action.payload.index].total =
        +action.payload.value * +state[action.payload.index].quantity
      return [...state]
    case 'ITEM_QUANTITY':
      state[action.payload.index].quantity = action.payload.value
      state[action.payload.index].total =
        +action.payload.value * +state[action.payload.index].price
      return [...state]
    case 'ADD_NEW_ITEM':
      return [
        ...state,
        {
          id: action.payload.index,
          name: '',
          price: '',
          quantity: '',
          total: 0
        }
      ]
    default:
      return state
  }
}

export const paymentInfoReducers = (
  state: PaymentInfoState,
  action: PaymentInfoAction
) => {
  switch (action.type) {
    case 'PAYMENT_TERMS':
      return {
        ...state,
        ...action.payload
      }
    case 'PAYMENT_METHOD':
      return {
        ...state,
        ...action.payload
      }
    case 'PAYMENT_STATUS':
      return {
        ...state,
        ...action.payload
      }
    case 'NOTES':
      return {
        ...state,
        ...action.payload
      }
    case 'GST_PERCENT':
      return {
        ...state,
        ...action.payload
      }
    case 'TAX':
      return {
        ...state,
        ...action.payload
      }
    case 'SHIPPING_CHARGES':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
