import {
  CustomerInfoAction,
  CustomerInfoState,
  InvoiceInfoAction,
  InvoiceInfoState,
  ItemsInfoAction,
  ItemsInfoState
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

export const itemsInfoReducers = (
  state: ItemsInfoState,
  action: ItemsInfoAction
) => {
  switch (action.type) {
    case 'ITEM_NAME':
      state[action.payload.index].name = action.payload.value + ''
      console.log(state)
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
