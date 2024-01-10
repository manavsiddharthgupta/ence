import extractAndValidateData from '../../../../validator/invoice'
export async function instantInvoiceCreateService(invoiceImageUrl: any) {
  const ACCESS_TOKEN = process.env.INVOICE_PARSER_ACCESS_TOKEN

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      providers: 'microsoft, mindee',
      language: 'en',
      file_url: `${invoiceImageUrl}`,
      fallback_providers: ''
    })
  }

  try {
    const response = await fetch(
      'https://api.edenai.run/v2/ocr/invoice_parser',
      options
    )
    const data = await response.json()

    const edenAiData = data['eden-ai']
    if (!edenAiData) {
      return null
    }
    const validatedData = extractAndValidateData(edenAiData.extracted_data)
    return validatedData
  } catch (error) {
    console.error(error)
    throw error
  }
}
