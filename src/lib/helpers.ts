import { toast } from 'react-toastify'
import { ToWords } from 'to-words'

export const formatAmount = (amount: number) => {
  const formattedNumber = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2
  })
  return '₹ ' + formattedNumber
}

export const callInfoToast = (info: string) => {
  toast.info(info, {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem('theme') === 'Light' ? 'light' : 'dark'
  })
}

export const callErrorToast = (info: string) => {
  toast.error(info, {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem('theme') === 'Light' ? 'light' : 'dark'
  })
}

export const formatTexttoCaps = (text: string) => {
  const firstChar = text[0].toLocaleUpperCase()
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

  const formattedDate = `${day} ${monthAbbreviation} '${year
    .toString()
    .padStart(2, '0')}`
  return formattedDate
}

const toWords = new ToWords({
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

export const numTowords = new ToWords()
