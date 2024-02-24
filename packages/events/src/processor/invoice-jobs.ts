import { sendInvoiceThroughMail } from 'send-media'
import { whatsappService } from '../../../../apps/web/src/integration/whatsapp/service'
export class InvoiceJobsProcessor {
  static async processInvoiceData(body: any) {
    console.log('processing started...')
    const invoiceData = body?.data
    const invoiceId = body?.invoiceId
    const email = body?.data?.customerInfo?.email
    if (!email || !invoiceData) {
      console.error('Invalid payload')
      return
    }
    await sendInvoiceThroughMail(email, invoiceData)
    // sending through whatsapp
    await whatsappService(invoiceData.customerInfo.name, invoiceData, invoiceId)
  }
}
