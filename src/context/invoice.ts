'use client'
import {
  InvoiceInfoInitialState,
  CustomerInfoInitialState,
  ItemsInfoInitialState,
  PaymentInfoInitailState
} from '@/reducers/createInvoice'
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
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

type InvoiceContextType = {
  customerInfoState: CustomerInfoState
  invoiceInfoState: InvoiceInfoState
  itemsInfoState: ItemsInfoState
  paymentInfoState: PaymentInfoState
  customerLegalName: string
  customerInfoDispatch: Dispatch<CustomerInfoAction>
  invoiceInfoDispatch: Dispatch<InvoiceInfoAction>
  itemsInfoDispatch: Dispatch<ItemsInfoAction>
  paymentInfoDispatch: Dispatch<PaymentInfoAction>
  setCustomerLegalName: Dispatch<SetStateAction<string>>
}

const InvoiceContext = createContext<InvoiceContextType>({
  customerInfoState: CustomerInfoInitialState,
  invoiceInfoState: InvoiceInfoInitialState,
  itemsInfoState: ItemsInfoInitialState,
  paymentInfoState: PaymentInfoInitailState,
  customerLegalName: '',
  customerInfoDispatch: () => {},
  invoiceInfoDispatch: () => {},
  itemsInfoDispatch: () => {},
  paymentInfoDispatch: () => {},
  setCustomerLegalName: () => {}
})

export const useInvoiceContext = () => useContext(InvoiceContext)

export const InvoiceProvider = InvoiceContext.Provider
