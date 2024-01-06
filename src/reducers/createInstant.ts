import { v4 as uuidv4 } from 'uuid'
import {
  InstantInvoice,
  InstantInvoiceAction,
  InstantInvoiceItems,
  InstantInvoiceItemsAction
} from '@/types/instant'

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

export const InitialInstantInvoiceItemsState: InstantInvoiceItems = []

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

export const instantInvoiceItemsReducers = (
  state: InstantInvoiceItems,
  action: InstantInvoiceItemsAction
) => {
  switch (action.type) {
    case 'ITEM_NAME':
      state[action.payload.index].name = action.payload.value + ''
      return [...state]
    case 'ITEM_PRICE':
      state[action.payload.index].price = action.payload.value
      return [...state]
    case 'ITEM_QUANTITY':
      state[action.payload.index].quantity = action.payload.value
      return [...state]
    case 'ADD_NEW_ITEM':
      return [
        ...state,
        {
          id: uuidv4(),
          name: '',
          price: '',
          quantity: ''
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