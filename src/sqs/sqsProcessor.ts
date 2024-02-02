import { InvoiceJobsProcessor } from './processors/invoice-jobs'
import { Constants } from '../utils/constants'

export class SQSProcessor {
  static async handleMessage(rawPayload: any) {
    try {
      if (!('Body' in rawPayload)) {
        console.log('Invalid payload', rawPayload)
        return
      }
      const body = JSON.parse(rawPayload.Body)
      const payload = body?.Message ? JSON.parse(body.Message) : body

      console.log('in sqs processor --->', body.name, payload)

      if (body.name === Constants.JOBS.INVOICE_DATA_TO_MEDIA) {
        console.log(Constants.JOBS.INVOICE_DATA_TO_MEDIA, payload)
        return InvoiceJobsProcessor.processInvoiceDataToMedia(payload)
      }

      if (body.name === Constants.JOBS.SEND_INVOICE_ON_WHATSAPP) {
        console.log(Constants.JOBS.SEND_INVOICE_ON_WHATSAPP, payload)
        return InvoiceJobsProcessor.processSendInvoiceToWhatsapp(payload)
      }

      if (
        body.name === Constants.JOBS.SEND_INVOICE_LINK_ON_ACCEPT_FOR_PAYMENT
      ) {
        console.log(
          Constants.JOBS.SEND_INVOICE_LINK_ON_ACCEPT_FOR_PAYMENT,
          payload
        )
        return InvoiceJobsProcessor.processSendInvoiceLinkOnWhatsapp(payload)
      }
    } catch (error) {
      console.log('Error occured in worker', error, rawPayload)
    }
  }
}
