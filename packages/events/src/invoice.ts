import { WorkerQueue } from './worker'
import { INVOICE_CONSTANTS } from '../constants'

export class InvoiceJobs {
  static async createMediaFromInvoiceDataJob(
    invoiceId: string,
    orgId: string,
    data: any
  ) {
    const job = {
      name: INVOICE_CONSTANTS.JOBS.INVOICE_DATA_TO_MEDIA,
      invoiceId: invoiceId,
      orgId: orgId,
      data: data
    }
    return WorkerQueue.push(job)
  }

  static async sendInvoiceOnWhatsappJob() {
    const job = {
      name: INVOICE_CONSTANTS.JOBS.SEND_INVOICE_ON_WHATSAPP
    }
    return WorkerQueue.push(job)
  }

  static async sendInvoiceLinkOnAcceptForPaymentJob() {
    const job = {
      name: INVOICE_CONSTANTS.JOBS.SEND_INVOICE_LINK_ON_ACCEPT_FOR_PAYMENT
    }
    return WorkerQueue.push(job)
  }
}
