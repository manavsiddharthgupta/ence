import { WorkerQueue } from '@/models/queues/worker'
import { Constants } from '@/utils/constants'

export class InvoiceJobs {
  static async createMediaFromInvoiceDataJob() {
    const job = {
      name: Constants.JOBS.INVOICE_DATA_TO_MEDIA
    }
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
