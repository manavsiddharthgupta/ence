'use client'
import { InitialInstantInvoiceDetails } from '@/reducers/createInstant'
import {} from '@/reducers/createInvoice'
import { InstantInvoice, InstantInvoiceAction } from '@/types/instant'
import {} from '@/types/invoice'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

type InstantInvoiceContextType = {
  instantInvoiceDetails: InstantInvoice
  paymentTerm: string
  sendingMethod: string
  paymentMethod: string
  dueDate: Date | undefined
  setPaymentTerm: Dispatch<SetStateAction<string>>
  setSendingMethod: Dispatch<SetStateAction<string>>
  setPaymentMethod: Dispatch<SetStateAction<string>>
  instantInvoiceDispatch: Dispatch<InstantInvoiceAction>
  setDueDate: Dispatch<SetStateAction<Date | undefined>>
}

const InstantInvoiceContext = createContext<InstantInvoiceContextType>({
  instantInvoiceDetails: InitialInstantInvoiceDetails,
  paymentTerm: '',
  paymentMethod: '',
  sendingMethod: '',
  dueDate: undefined,
  instantInvoiceDispatch: () => {},
  setPaymentMethod: () => {},
  setPaymentTerm: () => {},
  setSendingMethod: () => {},
  setDueDate: () => {}
})

export const useInstantInvoiceContext = () => useContext(InstantInvoiceContext)

export const InstantInvoiceProvider = InstantInvoiceContext.Provider
