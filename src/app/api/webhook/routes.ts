import whatsappWebhook from '@/webhooks/whatsapp'

export async function POST(request: Request) {
  whatsappWebhook(request)
}
