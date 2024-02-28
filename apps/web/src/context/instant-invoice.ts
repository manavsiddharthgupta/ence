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
import { Option } from '@/types/invoice'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

type InstantInvoiceContextType = {
  instantInvoiceDetails: InstantInvoice
  customerLegalName: Option | null
  paymentTerm: string
  sendingMethod: string
  paymentMethod: string
  dueDate: Date | undefined
  instantInvoiceItems: InstantInvoiceItems
  setCustomerLegalName: Dispatch<SetStateAction<Option | null>>
  setPaymentTerm: Dispatch<SetStateAction<string>>
  setSendingMethod: Dispatch<SetStateAction<string>>
  setPaymentMethod: Dispatch<SetStateAction<string>>
  instantInvoiceDispatch: Dispatch<InstantInvoiceAction>
  setDueDate: Dispatch<SetStateAction<Date | undefined>>
  instantInvoiceItemsDispatch: Dispatch<InstantInvoiceItemsAction>
}

const InstantInvoiceContext = createContext<InstantInvoiceContextType>({
  customerLegalName: null,
  instantInvoiceDetails: InitialInstantInvoiceDetails,
  instantInvoiceItems: InitialInstantInvoiceItemsState,
  paymentTerm: '',
  paymentMethod: '',
  sendingMethod: '',
  dueDate: undefined,
  setCustomerLegalName: () => {},
  instantInvoiceItemsDispatch: () => {},
  instantInvoiceDispatch: () => {},
  setPaymentMethod: () => {},
  setPaymentTerm: () => {},
  setSendingMethod: () => {},
  setDueDate: () => {}
})

export const useInstantInvoiceContext = () => useContext(InstantInvoiceContext)

export const InstantInvoiceProvider = InstantInvoiceContext.Provider
