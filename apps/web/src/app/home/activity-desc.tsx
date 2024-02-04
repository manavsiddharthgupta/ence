'use client'

import { formatDateTime } from 'helper/format'

export const Desc = ({
  desc,
  date,
  invoiceNumber
}: {
  desc: string
  date: Date
  invoiceNumber: string
}) => {
  const formattedDesc = `${desc} ${formatDateTime(date)}`
  return (
    <p className='pl-0.5 text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5'>
      {`${invoiceNumber}: ${formattedDesc}`}
    </p>
  )
}
