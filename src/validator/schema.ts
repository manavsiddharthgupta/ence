import { z } from 'zod'

const merchantSchema = z.object({
  merchant_name: z.string().nullable(),
  merchant_number: z.string().nullable(),
  merchant_email: z.string().nullable(),
  merchant_address: z.string().nullable()
})

const customerSchema = z.object({
  customer_name: z.string().nullable(),
  customer_number: z.string().nullable(),
  customer_email: z.string().nullable(),
  customer_address: z.string().nullable()
})

const itemSchema = z.object({
  description: z.string().nullable(),
  quantity: z.number().nullable(),
  unit_price: z.number().nullable(),
  total: z.number().nullable()
})

const invoiceSchema = z.object({
  merchant: merchantSchema,
  customer: customerSchema,
  invoice_number: z.string().nullable(),
  issue_date: z.string().nullable(),
  due_date: z.string().nullable(),
  items: z.array(itemSchema).nullable(),
  subtotal: z.number().nullable(),
  total: z.number().nullable(),
  discount: z.number().nullable(),
  service_charge: z.number().nullable()
})

export { merchantSchema, customerSchema, itemSchema, invoiceSchema }
