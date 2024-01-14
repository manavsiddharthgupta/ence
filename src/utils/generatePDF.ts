import puppeteer from 'puppeteer'

export const generatePdf = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const htmlContent = '<p>Test</p>'

  await page.emulateMediaType('screen')
  await page.setContent(htmlContent)

  await page.pdf({
    path: 'test.pdf',
    format: 'A4'
  })

  console.log('done')

  await browser.close()
}
