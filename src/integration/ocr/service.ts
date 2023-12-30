export const tranformImageToJSON = () => {
  const ACCESS_TOKEN = process.env.INSTANT_INVOICE_TOKEN

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      providers: 'microsoft, mindee',
      language: 'en',
      file_url:
        'https://iiif.dc.library.northwestern.edu/iiif/2/78dcec84-1b56-441b-84e2-5996d8431337/full/!640,637/0/default.jpg',
      fallback_providers: ''
    })
  }

  fetch('https://api.edenai.run/v2/ocr/invoice_parser', options)
    .then(response => response.json())
    .then(data => {
      const edenAiData = data['eden-ai']

      if (edenAiData.status === 'success') {
        console.log('Extracted Data', edenAiData.extracted_data)

        const firstElement = edenAiData.extracted_data[0]

        if (firstElement) {
          const itemLines = firstElement.item_lines

          if (itemLines && Array.isArray(itemLines)) {
            itemLines.forEach((item, index) => {
              console.log(`Item ${index + 1}:`)
              console.log(item)
              console.log('--------------------')
            })
          }
        }
      } else {
        console.error('Processing Failed')
      }
    })
    .catch(error => {
      console.error(error)
    })
}
