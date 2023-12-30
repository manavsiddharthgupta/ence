const ACCESS_TOKEN = process.env.INSTANT_INVOICE
const axios = require('axios').default
const options = {
  method: 'POST',
  url: 'https://api.edenai.run/v2/ocr/invoice_parser',
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`
  },
  data: {
    providers: 'microsoft, mindee',
    language: 'en',
    file_url:
      'https://iiif.dc.library.northwestern.edu/iiif/2/78dcec84-1b56-441b-84e2-5996d8431337/full/!640,637/0/default.jpg',
    fallback_providers: ''
  }
}
axios
  .request(options)
  /*@ts-ignore*/
  .then(response => {
    const edenAiData = response.data['eden-ai']

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
  /*@ts-ignore*/
  .catch(error => {
    console.error(error)
  })
