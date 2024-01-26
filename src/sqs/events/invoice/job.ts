import { WorkerQueue } from '@/sqs/models/queues/worker'
import { Constants } from '@/utils/constants'

export class InvoiceJobs {
  static async createMediaFromInvoiceDataJob(
    invoiceId: string,
    orgId: string,
    data: any,
    invoiceNumber: any
  ) {
    const job = {
      name: Constants.JOBS.INVOICE_DATA_TO_MEDIA,
      invoiceId: invoiceId,
      orgId: orgId,
      data: data,
      invoiceNumber: invoiceNumber
    }
    console.log('--->', data)
    return WorkerQueue.push(job)
  }

  static async sendInvoiceOnWhatsappJob() {
    const job = {
      name: Constants.JOBS.SEND_INVOICE_ON_WHATSAPP
    }
    return WorkerQueue.push(job)
  }

  static async sendInvoiceLinkOnAcceptForPaymentJob() {
    const job = {
      name: Constants.JOBS.SEND_INVOICE_LINK_ON_ACCEPT_FOR_PAYMENT
    }
    return WorkerQueue.push(job)
  }
}
