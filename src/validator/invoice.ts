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
    customer_name: extractedData.customer_information.customer_name || '',
    customer_number: extractedData.customer_information.customer_phone || '',
    customer_email: extractedData.customer_information.customer_email || '',
    customer_address: extractedData.customer_information.customer_address || ''
  }

  const itemsData = extractedData.item_lines.map((item: any) => ({
    description: item.description || '',
    quantity: item.quantity || '',
    unit_price: item.unit_price || '',
    total: item.amount || ''
  }))

  const invoiceData = {
    merchant: merchantSchema.parse(merchantData),
    customer: customerSchema.parse(customerData),
    invoice_number: extractedData.invoice_number || '',
    issue_date: extractedData.date || '',
    due_date: extractedData.due_date || '',
    items: itemsData.map((item: any) => itemSchema.parse(item)),
    subtotal: extractedData.invoice_subtotal || '',
    total: extractedData.invoice_total || '',
    discount: extractedData.discount || 0,
    service_charge: extractedData.service_charge || 0
  }

  return invoiceSchema.parse(invoiceData)
}

export default extractAndValidateData
