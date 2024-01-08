import { z } from 'zod'

const merchantSchema = z.object({
  merchant_name: z.string().nullable(),
  merchant_number: z.string().nullable(),
  merchant_email: z.string().nullable(),
  merchant_address: z.string().nullable()
})

const customerSchema = z.object({
  customerName: z.string().nullable(),
  customerNumber: z.string().nullable(),
  customerEmail: z.string().nullable(),
  customerAddress: z.string().nullable()
})

const itemSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  quantity: z.number().nullable(),
  price: z.number().nullable(),
  total: z.number().nullable()
})

const invoiceSchema = z.object({
  merchant: merchantSchema,
  customer: customerSchema,
  invoiceNumber: z.string().nullable(),
  dateIssue: z.string().nullable(),
  dueDate: z.string().nullable(),
  items: z.array(itemSchema).nullable(),
  subtotal: z.number().nullable(),
  total: z.number().nullable(),
  discount: z.number().nullable(),
  invoiceTotal: z.number().nullable(),
  service_charge: z.number().nullable()
})

export { merchantSchema, customerSchema, itemSchema, invoiceSchema }
