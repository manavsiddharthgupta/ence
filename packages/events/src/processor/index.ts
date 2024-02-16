import { InvoiceJobsProcessor } from './invoice-jobs'
import { Constants } from '../../constants'

export class Processor {
  static async handleMessage(payload: any) {
    try {
      const body = payload
      if (!body?.name) {
        console.log('There is no body name attached in payload')
        return
      }

      if (body.name === Constants.JOBS.PROCESS_INVOICE_DATA) {
        console.log(Constants.JOBS.PROCESS_INVOICE_DATA, body)
        return await InvoiceJobsProcessor.processInvoiceData(body)
      }

      return
    } catch (error) {
      console.log('Error occurred in worker', error, payload)
    }
  }
}
