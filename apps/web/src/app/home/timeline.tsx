'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrgInfo } from '@/context/org-info'
import { useTheme } from '@/context/theme'
import { WEEK_VALUES as getWeekName } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import { formatCompactNumber, CurrencyFormat } from 'helper/format'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const baseurl = process.env.NEXT_PUBLIC_API_URL

const formatData = (sales: any) => {
  if (!sales) {
    return []
  }

  const weeklySales: Record<string, number> = {}
  sales.forEach((entry: any) => {
    const entryDate = new Date(entry.dateIssue)
    const day = entryDate.getDate()

    if (!weeklySales[day]) {
      weeklySales[day] = 0
    }
    weeklySales[day] += entry.totalAmount
  })
  // Expense

  const currDateTime = new Date()
  const chartData = Array.from({ length: 7 }, (_, index) => {
    let date = currDateTime.getDate() - index
    let month = currDateTime.getMonth()

    if (date <= 0) {
      // calculates the days in the previous month
      const daysInPreviousMonth = new Date(
        currDateTime.getFullYear(),
        month,
        0
      ).getDate()
      date = daysInPreviousMonth + date
      month -= 1

      if (month < 0) {
        month = 11
        currDateTime.setFullYear(currDateTime.getFullYear() - 1)
      }
    }
    const day = (currDateTime.getDay() - index + 7) % 7
    return {
      Date: date,
      Week: getWeekName[day],
      Sales: weeklySales[date] || 0,
      Expense: 0
    }
  })
  return chartData
}

export const TimeLine = () => {
  const { theme } = useTheme()
  const {
    orgInfo: { currency_type }
  } = useOrgInfo()
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch(`${baseurl}/api/invoice/chart/sales-expense`).then((res) =>
        res.json()
      )
  })

  if (isPending)
    return (
      <Skeleton className='rounded-3xl  w-[54%]  h-[400px] bg-gray-500/10' />
    )

  if (error)
    return (
      <div className='rounded-3xl flex justify-center items-center w-[54%] border bg-red-500/5 border-red-400'>
        <p className='text-xs text-red-500'>Something went wrong :(</p>
      </div>
    )

  const chartData = formatData(data?.data?.sales)
  return (
    <div className='rounded-3xl w-[54%] border border-zinc-400/20 dark:border-zinc-600/20 px-3 pb-4 h-[400px] pt-6'>
      <h2 className='text-lg px-4 font-medium mb-6'>Sales this Week</h2>
      <ResponsiveContainer width='100%' height='86%'>
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
          }}
        >
          <XAxis
            dataKey='Week'
            tickLine={false}
            fontSize='10px'
            axisLine={false}
            color={`${theme === 'Dark' ? 'black' : 'white'}`}
            padding={{ left: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={65}
            padding={{ bottom: 10 }}
            color={`${theme === 'Dark' ? '#f4f4f5' : '#18181b'}`}
            tickFormatter={(number: number) =>
              currency_type !== '☒'
                ? `${
                    CurrencyFormat[currency_type].symbol
                  } ${formatCompactNumber(number)}`
                : `☒ ${formatCompactNumber(number)}`
            }
            fontSize='10px'
          />
          <Bar
            dataKey='Sales'
            fill={`${theme === 'Dark' ? '#f4f4f5' : '#18181b'}`}
            opacity={0.9}
          />
          {/* <Bar dataKey='Expense' fill='red' opacity={0.5} /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
