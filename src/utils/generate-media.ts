import puppeteer from 'puppeteer'
import fs from 'fs'
import hbs from 'handlebars'

const compile = async (templatePath: string, data: any) => {
  const htmlContent = await fs.promises.readFile(templatePath, 'utf8')

  return hbs.compile(htmlContent)(data)
}

export const generateMedia = async (
  templateName: string,
  category: string,
  data: any,
  type: 'PDF' | 'IMAGE'
) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const content = await compile(
    `src/resources/templates/${category}/${templateName}.hbs`,
    data
  )

  await page.emulateMediaType('screen')
  await page.setContent(content)

  if (type === 'IMAGE') {
    const imgBuffer = await page.screenshot({
      fullPage: true
    })
    await page.close()
    await browser.close()
    return imgBuffer
  }

  const pdfBuffer = await page.pdf({
    format: 'A4'
  })
  await page.close()
  await browser.close()
  return pdfBuffer
}
