import { InvoiceGenerateMedia } from '@/lib/invoice/generate-media'
import { uploadFilesToS3 } from '@/resources/s3'

export class InvoiceJobsProcessor {
  static async processInvoiceDataToMedia(value: any) {
    const imageBufferData = await InvoiceGenerateMedia.generateImage({})
    const fileUrl = await uploadFilesToS3(
      'ence-invoice',
      'test',
      imageBufferData
    )
    console.log(fileUrl)
  }

  static async processSendInvoiceToWhatsapp(value: any) {}

  static async processSendInvoiceLinkOnWhatsapp(value: any) {}
}
