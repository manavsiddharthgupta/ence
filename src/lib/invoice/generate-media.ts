import { generateMedia } from '../../utils/generate-media'
const template = 'default'
const category = 'invoices'
export class InvoiceGenerateMedia {
  static generatePDF = async (data: any) => {
    return await generateMedia(template, category, data, 'PDF')
  }

  static generateImage = async (data: any) => {
    return await generateMedia(template, category, data, 'IMAGE')
  }
}
