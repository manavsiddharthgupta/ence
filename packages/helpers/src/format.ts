import { ToWords } from 'to-words'
import { CurrencyType } from 'database'

export const formatAmount = (amount: number, currency?: CurrencyType | '☒') => {
  if (currency && currency !== '☒') {
    const formattedNumber = amount.toLocaleString(
      CurrencyFormat[currency].locale,
      {
        maximumFractionDigits: 2
      }
    )

    return CurrencyFormat[currency].symbol + ' ' + formattedNumber
  }

  const formattedNumber = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2
  })
  return '☒ ' + formattedNumber
}

export const formatAmountWithRs = (
  amount: number,
  currency?: CurrencyType | null
) => {
  if (currency) {
    const formattedNumber = amount.toLocaleString(
      CurrencyFormat[currency].locale,
      {
        maximumFractionDigits: 2
      }
    )
    return currency + ' ' + formattedNumber
  }
  const formattedNumber = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2
  })
  return ' ' + formattedNumber
}

export const formatTextToCaps = (text: string) => {
  const firstChar = text[0]?.toUpperCase()
  const splittedText = text.slice(1)
  return firstChar + splittedText
}

export const formatDate = (inputDate: Date | undefined) => {
  if (!inputDate) {
    return '-'
  }
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const date = new Date(inputDate)
  const day = date.getDate()
  const monthAbbreviation = months[date.getMonth()]
  const year = date.getFullYear() % 100 // Get last two digits of the year

  const formattedDate = `${day
    .toString()
    .padStart(2, '0')} ${monthAbbreviation} ${year.toString().padStart(2, '0')}`
  return formattedDate
}

export const numTowords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: ''
      }
    }
  }
})

export function formatNumberToWords(locale: string) {
  return new ToWords({
    localeCode: locale,
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false
    }
  })
}

export function formatDateTime(dateString: Date): string {
  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'

  const formattedDate = `${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()} at ${format12HourTime(
    hours,
    minutes
  )} ${ampm}`

  return formattedDate
}

function format12HourTime(hours: number, minutes: number): string {
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString()
  return `${formattedHours}:${formattedMinutes}`
}

export function formatCompactNumber(number: number) {
  if (number < 1000) {
    return number
  } else if (number >= 1000 && number < 1_000_000) {
    return (number / 1000).toFixed(1) + 'K'
  } else if (number >= 1_000_000 && number < 1_000_000_000) {
    return (number / 1_000_000).toFixed(1) + 'M'
  } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
    return (number / 1_000_000_000).toFixed(1) + 'B'
  } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
    return (number / 1_000_000_000_000).toFixed(1) + 'T'
  }
}

export const CurrencyFormat = {
  USD: { name: 'United States Dollar', symbol: '$', locale: 'en-US' },
  EUR: { name: 'Euro', symbol: '€', locale: 'en-EU' },
  JPY: { name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  GBP: { name: 'British Pound Sterling', symbol: '£', locale: 'en-GB' },
  AUD: { name: 'Australian Dollar', symbol: '$', locale: 'en-AU' },
  CAD: { name: 'Canadian Dollar', symbol: '$', locale: 'en-CA' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
  SEK: { name: 'Swedish Krona', symbol: 'kr', locale: 'sv-SE' },
  NZD: { name: 'New Zealand Dollar', symbol: '$', locale: 'en-NZ' },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', locale: 'no-NO' },
  SGD: { name: 'Singapore Dollar', symbol: '$', locale: 'en-SG' },
  KRW: { name: 'South Korean Won', symbol: '₩', locale: 'ko-KR' },
  INR: { name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR' },
  ZAR: { name: 'South African Rand', symbol: 'R', locale: 'en-ZA' },
  AED: { name: 'United Arab Emirates Dirham', symbol: 'د.إ', locale: 'ar-AE' },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', locale: 'zh-HK' },
  THB: { name: 'Thai Baht', symbol: '฿', locale: 'th-TH' },
  MXN: { name: 'Mexican Peso', symbol: '$', locale: 'es-MX' }
}
