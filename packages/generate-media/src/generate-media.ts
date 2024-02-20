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
  return null
}
