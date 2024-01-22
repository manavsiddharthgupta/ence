import whatsappWebhookModule from '@/webhooks/whatsapp'
import { NextApiRequest } from 'next'

export async function POST(request: NextApiRequest) {
  whatsappWebhookModule(request)
}
