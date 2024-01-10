import { v4 as uuidv4 } from 'uuid'
import {
  merchantSchema,
  customerSchema,
  itemSchema,
  invoiceSchema
} from './schema'

function extractAndValidateData(data: any) {
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

export default extractAndValidateData
