import { WorkerQueue } from './worker'
import { Constants } from '../../constants'

export class InvoiceJobs {
  static async createMediaFromInvoiceDataJob(
    invoiceId: string,
    orgId: string,
    data: any
  ) {
    const job = {
      name: Constants.JOBS.PROCESS_INVOICE_DATA,
      invoiceId: invoiceId,
      orgId: orgId,
      data: data
    }
    return WorkerQueue.push(job)
  }
}
