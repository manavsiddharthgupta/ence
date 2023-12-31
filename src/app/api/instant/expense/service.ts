export async function instantExpenseCreateService(expenseImageUrl: any) {
  const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTY5YWM3M2YtMTE1My00ZTI5LWFiODgtMGE5NTNlMWUzMjgwIiwidHlwZSI6ImFwaV90b2tlbiJ9.qNksVv5XVjH_F9TmC7hC9jcNqddk5VEqiLBx_6mOfEI'

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      providers: 'microsoft, mindee',
      language: 'en',
      file_url: `${expenseImageUrl}`,
      fallback_providers: ''
    })
  }

  try {
    const response = await fetch(
      'https://api.edenai.run/v2/ocr/receipt_parser',
      options
    )
    const data = await response.json()
    console.log('Expense API Response:', data)
  } catch (error) {
    console.log(error)
    throw new Error()
  }
}
