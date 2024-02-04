import { v4 as uuidv4 } from 'uuid'
import {
  merchantSchema,
  customerSchema,
  itemSchema,
  invoiceSchema
} from './schema'

export function extractAndValidateData(data: any) {
  const extractedData = data[0]
  const merchantData = {
    merchant_name: extractedData.merchant_information.merchant_name || '',
    merchant_number: extractedData.merchant_information.merchant_phone || '',
    merchant_email: extractedData.merchant_information.merchant_email || '',
    merchant_address: extractedData.merchant_information.merchant_address || ''
  }

  const customerData = {
    customerName: extractedData.customer_information.customer_name || '',
    customerNumber: extractedData.customer_information.customer_phone || '',
    customerEmail: extractedData.customer_information.customer_email || '',
    customerAddress: extractedData.customer_information.customer_address || ''
  }

  const itemsData = extractedData.item_lines.map((item: any) => ({
    id: uuidv4(),
    name: item.description || '',
    quantity: item.quantity || 0,
    price: item.unit_price || 0,
    total: item.amount || 0
  }))

  const invoiceData = {
    merchant: merchantSchema.parse(merchantData),
    customer: customerSchema.parse(customerData),
    invoiceNumber: extractedData.invoice_number || '',
    dateIssue: extractedData.date || '',
    dueDate: extractedData.due_date || '',
    items: itemsData.map((item: any) => itemSchema.parse(item)),
    subtotal: extractedData.invoice_subtotal || 0,
    total: extractedData.invoice_total || 0,
    discount: extractedData.discount || 0,
    invoiceTotal: extractedData.invoice_total || 0,
    service_charge: extractedData.service_charge || 0
  }

  return invoiceSchema.parse(invoiceData)
}

export function modifyAndValidateInstantInvoice(data: any) {
  const merchantData = {
    merchant_name: data?.MerchantName || '',
    merchant_number: data?.MerchantNumber || '',
    merchant_email: data?.MerchantEmail || '',
    merchant_address: data?.MerchantAddress || ''
  }

  const customerData = {
    customerName: data?.CustomerName || '',
    customerNumber: data?.CustomerNumber || '',
    customerEmail: data?.CustomerEmail || '',
    customerAddress: data?.CustomerAddress || ''
  }

  const itemsData = data?.ItemDetails?.map((item: any) => ({
    id: uuidv4(),
    name: item?.Description || '',
    quantity: item?.Quantity || 0,
    price: item?.ItemPrice || 0,
    total: item?.TotalPrice || 0
  }))

  const invoiceData = {
    merchant: merchantData,
    customer: customerData,
    dateIssue: data?.IssueDate || '',
    dueDate: data?.DueDate || '',
    items: itemsData,
    subtotal: data?.SubTotal || 0,
    discount: data?.DiscountValue || 0,
    invoiceTotal: data?.Total || 0,
    service_charge: data?.Tax || 0,
    total: data?.GrandTotal || 0
  }
  return invoiceData
}

export interface ParsedInvoice {
  Merchantname: string
  MerchantAddress: string
  MerchantNumber: string
  MerchantEmail: string
  Customername: string
  CustomerNumber: string
  CustomerEmail: string
  CustomerAddress: string
  IssueDate: Date
  DueDate: Date
  ItemDetails: ItemDetailsEntity[]
  SubTotal: number
  DiscountRate: number
  DiscountValue: number
  Total: number
  Tax: number
  GrandTotal: number
}
export interface ItemDetailsEntity {
  Description: string
  Quantity: number
  ItemPrice: number
  TotalPrice: number
}
