import { ToWords } from 'to-words'

export const formatAmount = (amount: number) => {
  const formattedNumber = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2
  })
  return '₹ ' + formattedNumber
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
