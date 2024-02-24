export const whatsappService = async (
  customerName: string,
  invoiceLink: string | null,
  invoiceId: string | null,
  customerNumber?: string
) => {
  const url = 'https://graph.facebook.com/v18.0/195250480342179/messages'
  const accessToken = process.env.WHATSAPP_TOKEN

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }

  const data = {
    messaging_product: 'whatsapp',
    to: '916207337493',
    type: 'template',
    template: {
      name: 'ence1',
      language: {
        code: 'en'
      },
      components: [
        {
          type: 'header',
          parameters: [
            {
              type: 'image',
              image: {
                link: invoiceLink
              }
            }
          ]
        },
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: customerName
            }
          ]
        }
      ]
    },
    invoiceId: invoiceId
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })

    await response.json()
  } catch (error) {
    console.error('Error:', error)
  }
}
