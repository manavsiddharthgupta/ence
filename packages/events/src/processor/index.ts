import { InvoiceJobsProcessor } from './invoice-jobs'
import { Constants } from '../../constants'

export class Processor {
  static async handleMessage(rawPayload: any) {
    try {
      const body = JSON.parse(rawPayload)
      if (!body?.name) {
        console.log('There is no body name attached in payload')
        return
      }

      if (body.name === Constants.JOBS.INVOICE_DATA_TO_MEDIA) {
        console.log(Constants.JOBS.INVOICE_DATA_TO_MEDIA, body)
        return InvoiceJobsProcessor.processInvoiceDataToMedia(body)
      }

      if (body.name === Constants.JOBS.SEND_INVOICE_ON_WHATSAPP) {
        console.log(Constants.JOBS.SEND_INVOICE_ON_WHATSAPP, body)
        return InvoiceJobsProcessor.processSendInvoiceToWhatsapp(body)
      }

      if (
        body.name === Constants.JOBS.SEND_INVOICE_LINK_ON_ACCEPT_FOR_PAYMENT
      ) {
        console.log(
          Constants.JOBS.SEND_INVOICE_LINK_ON_ACCEPT_FOR_PAYMENT,
          body
        )
        return InvoiceJobsProcessor.processSendInvoiceLinkOnWhatsapp(body)
      }
    } catch (error) {
      console.log('Error occured in worker', error, rawPayload)
    }
  }
}
