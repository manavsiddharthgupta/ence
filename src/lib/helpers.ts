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
