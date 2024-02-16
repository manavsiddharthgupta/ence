import { chromium } from 'playwright'
import fs from 'fs'
import hbs from 'handlebars'
import { formatAmount, formatDate, numTowords } from 'helper/format'

const compile = async (templatePath: string, data: any) => {
  const htmlContent = await fs.promises.readFile(templatePath, 'utf8')

  return hbs.compile(htmlContent)(data)
}
hbs.registerHelper('formatDate', function (value) {
  return formatDate(value)
})
hbs.registerHelper('formatAmount', function (value) {
  return formatAmount(value || 0)
})

hbs.registerHelper('formatAmountInwords', function (value) {
  return numTowords.convert(value || 0, {
    currency: true
  })
})

export const generateMedia = async (
  templateName: string,
  category: string,
  data: any,
  type: 'PDF' | 'IMAGE'
) => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const content = await compile(
    `src/templates/${category}/${templateName}.hbs`,
    data
  )

  await page.emulateMedia({ media: 'screen' })
  await page.setContent(content)

  if (type === 'IMAGE') {
    await page.setViewportSize({ width: 630, height: 891 })
    const imgBuffer = await page.screenshot()
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
