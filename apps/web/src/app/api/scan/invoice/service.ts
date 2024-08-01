import {
  extractAndValidateData,
  modifyAndValidateInstantInvoice
} from '@/validator/invoice'
import { GoogleGenerativeAI } from '@google/generative-ai'
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

export async function instantInvoiceCreateServiceByGemini(
  invoiceImageUrl: string
) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
  async function run(invoiceImageUrl: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt =
      'Firstly check if the image is really an invoice if not then give fields as N/A. Parse the given invoice to extract the following details in JSON format  MerchantName, MerchantAddress,MerchantNumber, MerchantEmail, CustomerName, CustomerNumber, CustomerEmail, CustomerAddress, IssueDate, DueDate, ItemDetails [{Description(remember to not include quantity here but just the description that should be in a single string), Quantity, ItemPrice, TotalPrice}], SubTotal, DiscountRate, DiscountValue, Total, Tax, GrandTotal. If a field is not present in the invoice, the corresponding value in the response will be empty. Ensure that the data is correct and valid type for the corresponding field. Ensure that in the value of each field, there are exactly two double quotes – one at the beginning and one at the end. For example, if the value is "12 pk 10" Pen refills", correct it to "12 pk 10 Pen refills" to maintain the required format.'

    async function urlToGenerativePart(url: string, mimeType: any) {
      const response = await fetch(url)
      const data = await response.arrayBuffer()

      return {
        inlineData: {
          data: Buffer.from(new Uint8Array(data)).toString('base64'),
          mimeType
        }
      }
    }

    const imageParts = [await urlToGenerativePart(invoiceImageUrl, 'image/png')]
    const result = await model.generateContent([prompt, ...imageParts])
    const response = result.response
    const parsedResponse = response.text()

    if (!parsedResponse) {
      return null
    }

    const cleanDataString = parsedResponse.replace(/```/g, '').trim()
    const finalDataString = cleanDataString.replace(/JSON|json/g, '')

    return JSON.parse(finalDataString)
  }
  try {
    const parsedInvoice = await run(invoiceImageUrl)
    if (!parsedInvoice) {
      return null
    }
    return modifyAndValidateInstantInvoice(parsedInvoice)
  } catch (error) {
    console.error('Error processing invoice:', error)
    return null
  }
}
