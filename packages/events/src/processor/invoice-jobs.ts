import { sendInvoiceThroughMail } from 'send-media'
export class InvoiceJobsProcessor {
  static async processInvoiceData(body: any) {
    console.log('processing started...')
    const invoiceData = body?.data
    const email = body?.data?.customerInfo?.email
    if (!email || !invoiceData) {
      console.error('Invalid payload')
      return
    }
    await sendInvoiceThroughMail(email, invoiceData)
    // sending through whatsapp
  }
}
