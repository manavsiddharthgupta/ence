import { toast } from 'react-toastify'

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
