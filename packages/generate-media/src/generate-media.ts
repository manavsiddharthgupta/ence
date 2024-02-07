import * as puppeteer from 'puppeteer'
import * as fs from 'fs'
import * as hbs from 'handlebars'
import {
  formatAmount,
  formatDate,
  numTowords
} from '../../../packages/helpers/src/format'

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
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const content = await compile(
    `src/templates/${category}/${templateName}.hbs`,
    data
  )

  await page.emulateMediaType('screen')
  await page.setContent(content)

  if (type === 'IMAGE') {
    await page.setViewport({ width: 630, height: 891, deviceScaleFactor: 2 })
    // await page.setViewport({ width: 840, height: 1188, deviceScaleFactor: 2 })
    const imgBuffer = await page.screenshot({
      fullPage: true,
      type: 'png',
      encoding: 'base64'
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
