import whatsappWebhookModule from '@/webhooks/whatsapp'

export async function POST(request: Request) {
  whatsappWebhookModule(request)
}
