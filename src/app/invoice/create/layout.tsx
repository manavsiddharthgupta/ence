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
import { useReducer, useState } from 'react'

export default function CreateInvoiceLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [customerLegalName, setCustomerLegalName] = useState('')
  const [subTotal, setSubTotal] = useState(0)
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
    JSON.parse(JSON.stringify(ItemsInfoInitialState))
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
        paymentInfoState,
        customerLegalName,
        setCustomerLegalName,
        subTotal,
        setSubTotal
      }}
    >
      {children}
    </InvoiceProvider>
  )
}
