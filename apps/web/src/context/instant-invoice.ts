'use client'
import {
  InitialInstantInvoiceDetails,
  InitialInstantInvoiceItemsState
} from '@/reducers/createInstant'
import {
  InstantInvoice,
  InstantInvoiceAction,
  InstantInvoiceItems,
  InstantInvoiceItemsAction
} from '@/types/instant'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

type InstantInvoiceContextType = {
  instantInvoiceDetails: InstantInvoice
  paymentTerm: string
  sendingMethod: string
  paymentMethod: string
  dueDate: Date | undefined
  instantInvoiceItems: InstantInvoiceItems
  setPaymentTerm: Dispatch<SetStateAction<string>>
  setSendingMethod: Dispatch<SetStateAction<string>>
  setPaymentMethod: Dispatch<SetStateAction<string>>
  instantInvoiceDispatch: Dispatch<InstantInvoiceAction>
  setDueDate: Dispatch<SetStateAction<Date | undefined>>
  instantInvoiceItemsDispatch: Dispatch<InstantInvoiceItemsAction>
}

const InstantInvoiceContext = createContext<InstantInvoiceContextType>({
  instantInvoiceDetails: InitialInstantInvoiceDetails,
  instantInvoiceItems: InitialInstantInvoiceItemsState,
  paymentTerm: '',
  paymentMethod: '',
  sendingMethod: '',
  dueDate: undefined,
  instantInvoiceItemsDispatch: () => {},
  instantInvoiceDispatch: () => {},
  setPaymentMethod: () => {},
  setPaymentTerm: () => {},
  setSendingMethod: () => {},
  setDueDate: () => {}
})

export const useInstantInvoiceContext = () => useContext(InstantInvoiceContext)

export const InstantInvoiceProvider = InstantInvoiceContext.Provider
