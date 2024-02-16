import { EmailTemplate } from '../res/invoice-email'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendInvoiceThroughMail = async (to: string, invoiceData: any) => {
  try {
    const data = await resend.emails.send({
      from: 'INVOICE <approveinvoice@ence.in>',
      to: to,
      subject: 'Confirm your invoice',
      react: EmailTemplate({ invoiceData: invoiceData })
    })
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}
