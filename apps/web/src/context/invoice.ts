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
  PaymentInfoState,
  Option
} from '@/types/invoice'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

type InvoiceContextType = {
  customerInfoState: CustomerInfoState
  invoiceInfoState: InvoiceInfoState
  itemsInfoState: ItemsInfoState
  paymentInfoState: PaymentInfoState
  customerLegalName: Option | null
  subTotal: number
  customerInfoDispatch: Dispatch<CustomerInfoAction>
  invoiceInfoDispatch: Dispatch<InvoiceInfoAction>
  itemsInfoDispatch: Dispatch<ItemsInfoAction>
  paymentInfoDispatch: Dispatch<PaymentInfoAction>
  setCustomerLegalName: Dispatch<SetStateAction<Option | null>>
  setSubTotal: Dispatch<SetStateAction<number>>
}

const InvoiceContext = createContext<InvoiceContextType>({
  customerInfoState: CustomerInfoInitialState,
  invoiceInfoState: InvoiceInfoInitialState,
  itemsInfoState: ItemsInfoInitialState,
  paymentInfoState: PaymentInfoInitailState,
  customerLegalName: null,
  subTotal: 0,
  customerInfoDispatch: () => {},
  invoiceInfoDispatch: () => {},
  itemsInfoDispatch: () => {},
  paymentInfoDispatch: () => {},
  setCustomerLegalName: () => {},
  setSubTotal: () => {}
})

export const useInvoiceContext = () => useContext(InvoiceContext)

export const InvoiceProvider = InvoiceContext.Provider
