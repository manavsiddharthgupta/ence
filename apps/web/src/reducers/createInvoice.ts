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
import { v4 as uuidv4 } from 'uuid'

export const CustomerInfoInitialState: CustomerInfoState = {
  id: null,
  legalName: null
}

export const InvoiceInfoInitialState: InvoiceInfoState = {
  invoiceNumber: null,
  dateIssue: undefined,
  dueDate: undefined,
  sendingMethod: 'mail'
}

export const ItemsInfoInitialState: ItemsInfoState = []

export const PaymentInfoInitailState: PaymentInfoState = {
  terms: 'immediate',
  status: 'due',
  method: 'cash',
  discount: '0',
  notes: 'Thank you for your business! We appreciate your trust.',
  tax: '0',
  lateCharge: '0',
  packagingCharge: '0',
  additionalCharges: '0',
  shippingCharge: '0',
  adjustmentFee: '0'
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
    case 'CUSTOMER_SET_ALL':
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
          id: uuidv4(),
          name: '',
          price: '',
          quantity: '',
          total: 0
        }
      ]
    case 'DELETE_ITEM':
      if (state.length < 2) {
        return state
      }
      const filteredItems = state.filter((item) => {
        return item.id !== action.payload.value
      })
      return [...filteredItems]
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
    case 'DISCOUNT_PERCENT':
      return {
        ...state,
        ...action.payload
      }
    case 'TAX':
      return {
        ...state,
        ...action.payload
      }
    case 'LATE_CHARGE':
      return {
        ...state,
        ...action.payload
      }
    case 'PACKAGE_CHARGE':
      return {
        ...state,
        ...action.payload,
        additionalCharges:
          +state.shippingCharge + +(action.payload as any).packagingCharge
      }
    case 'SHIPPING_CHARGES':
      return {
        ...state,
        ...action.payload,
        additionalCharges:
          +state.packagingCharge + +(action.payload as any).shippingCharge
      }
    case 'ADJUSTMENT_FEE':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
