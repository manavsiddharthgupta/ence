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

  async function run(invoiceImageUrl: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

    const prompt =
      'Firstly check if the image is really an invoice if not then give fields as empty. Parse the given invoice to extract the following details in JSON format  MerchantName, MerchantAddress,MerchantNumber, MerchantEmail, CustomerName, CustomerNumber, CustomerEmail, CustomerAddress, IssueDate, DueDate, ItemDetails [{Description(remember to not include quantity here but just the decription that should be in a single string), Quantity, ItemPrice, TotalPrice}], SubTotal, DiscountRate, DiscountValue, Total, Tax, GrandTotal. If a field is not present in the invoice, the corresponding value in the response will be empty. Ensure that the data is correct and valid type for the corresponding field.'

    const imageParts = [await urlToGenerativePart(invoiceImageUrl, 'image/png')]
    const result = await model.generateContent([prompt, ...imageParts])
    const response = result.response
    const parsedResponse = response.text()
    console.log('response --->', parsedResponse)
    if (!parsedResponse) {
      return null
    }
    const cleanDataString = parsedResponse.replace(/```/g, '').trim()
    const finalDataString = cleanDataString.replace('JSON', '')
    return finalDataString
  }
  try {
    const invoiceData = await run(invoiceImageUrl)
    if (!invoiceData) {
      return null
    }
    console.log('data check --->', invoiceData)
    const parsedInvoice = JSON.parse(invoiceData)
    return modifyAndValidateInstantInvoice(parsedInvoice)
  } catch (error) {
    console.error('Error processing invoice:', error)
    return null
  }
}
