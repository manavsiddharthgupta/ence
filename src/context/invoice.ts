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
import { Dispatch, createContext, useContext } from 'react'

type InvoiceContextType = {
  customerInfoState: CustomerInfoState
  invoiceInfoState: InvoiceInfoState
  itemsInfoState: ItemsInfoState
  paymentInfoState: PaymentInfoState
  customerInfoDispatch: Dispatch<CustomerInfoAction>
  invoiceInfoDispatch: Dispatch<InvoiceInfoAction>
  itemsInfoDispatch: Dispatch<ItemsInfoAction>
  paymentInfoDispatch: Dispatch<PaymentInfoAction>
}

const InvoiceContext = createContext<InvoiceContextType>({
  customerInfoState: CustomerInfoInitialState,
  invoiceInfoState: InvoiceInfoInitialState,
  itemsInfoState: ItemsInfoInitialState,
  paymentInfoState: PaymentInfoInitailState,
  customerInfoDispatch: () => {},
  invoiceInfoDispatch: () => {},
  itemsInfoDispatch: () => {},
  paymentInfoDispatch: () => {}
})

export const useInvoiceContext = () => useContext(InvoiceContext)

export const InvoiceProvider = InvoiceContext.Provider
