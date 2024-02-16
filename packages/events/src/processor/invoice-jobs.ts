import { sendInvoiceThroughMail } from 'send-media'
import { InvoiceGenerateMedia } from 'media-generator'
import { uploadFilesToS3 } from 'helper/s3'
import { db } from '../../db'
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
    const imageBuffer = await InvoiceGenerateMedia.generateImage(invoiceData)
    const fileUrl = await uploadFilesToS3(
      'ence-invoice',
      invoiceData.id,
      imageBuffer
    )
    if (!fileUrl) {
      console.error('Error while uploading invoice image to s3')
      return
    }
    try {
      const res = await db.invoiceRelatedDocument.create({
        data: {
          name: 'MAIN_IMAGE',
          documentLink: fileUrl,
          invoiceId: invoiceData?.id
        }
      })
      console.log('Image created sucessfully for the invoice', res)
      return
    } catch (err) {
      console.error('Something went wrong', err)
    }
  }

  static async processSendInvoiceToWhatsapp(body: any) {}

  static async processSendInvoiceLinkOnWhatsapp(body: any) {}
}
