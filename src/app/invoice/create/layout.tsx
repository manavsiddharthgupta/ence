'use client'
import { InvoiceProvider } from '@/context/invoice'
import {
  CustomerInfoInitialState,
  customerInfoReducers,
  InvoiceInfoInitialState,
  invoiceInfoReducers,
  ItemsInfoInitialState,
  itemsInfoReducers,
  PaymentInfoInitailState,
  paymentInfoReducers
} from '@/reducers/createInvoice'
import { useReducer } from 'react'

export default function CreateInvoiceLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [customerInfoState, customerInfoDispatch] = useReducer(
    customerInfoReducers,
    CustomerInfoInitialState
  )
  const [invoiceInfoState, invoiceInfoDispatch] = useReducer(
    invoiceInfoReducers,
    InvoiceInfoInitialState
  )
  const [itemsInfoState, itemsInfoDispatch] = useReducer(
    itemsInfoReducers,
    ItemsInfoInitialState
  )
  const [paymentInfoState, paymentInfoDispatch] = useReducer(
    paymentInfoReducers,
    PaymentInfoInitailState
  )
  return (
    <InvoiceProvider
      value={{
        customerInfoState,
        customerInfoDispatch,
        invoiceInfoDispatch,
        invoiceInfoState,
        itemsInfoState,
        itemsInfoDispatch,
        paymentInfoDispatch,
        paymentInfoState
      }}
    >
      {children}
    </InvoiceProvider>
  )
}
