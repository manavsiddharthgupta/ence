import { InvoicesResponse } from '@/types/invoice'
import { formatAmount, formatDate } from 'helper/format'

const baseURI = process.env.NEXT_PUBLIC_API_URL
export const invoicetextToWhatsappUrl = (invoice: InvoicesResponse) => {
  const baseWhatsappUrl = `https://api.whatsapp.com/send/?phone=91${invoice.customerInfo.whatsAppNumber}&text=Hello%20${invoice.customerInfo.legalName}%2C`

  const approveLink =
    baseURI +
    '/invoice-approval?aliasId=' +
    invoice.tokens.find((token) => {
      return token.type === 'INV_APPROVE'
    })?.id +
    '&status=approve'

  const rejectLink =
    baseURI +
    '/invoice-approval?aliasId=' +
    invoice.tokens.find((token) => {
      return token.type === 'INV_REJECT'
    })?.id +
    '&status=reject'

  const msg = encodeURIComponent(`

Confirm your Invoice INV-${invoice?.invoiceNumber} 

Invoice from ${invoice?.organization.orgName} 
${formatAmount(invoice?.totalAmount || 0)} 
Due Date: ${formatDate(invoice?.dueDate)}

This is a friendly reminder that you need to approve the invoice at your earliest convenience.
Thank you!

Approve Link - ${approveLink}

Reject Link - ${rejectLink}
`)

  return baseWhatsappUrl + msg
}
