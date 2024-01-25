'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { WEEK_VALUES as getWeekName } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import { Card, AreaChart } from '@tremor/react'

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
    const date = currDateTime.getDate() - index
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
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch(`${baseurl}/api/invoice/chart/sales-expense`).then((res) =>
        res.json()
      )
  })

  if (isPending)
    return (
      <Skeleton className='rounded-3xl  w-[54%] h-[336px] bg-gray-500/10' />
    )

  if (error)
    return (
      <div className='rounded-3xl flex justify-center items-center w-[54%] border bg-red-500/5 border-red-400'>
        <p className='text-xs text-red-500'>Something went wrong :(</p>
      </div>
    )

  const chartData = formatData(data?.data?.sales)
  return (
    <div className='rounded-3xl w-[54%] border border-zinc-400/20 dark:border-zinc-600/20'>
      <Card className='ring-0 bg-transparent'>
        <h2 className='text-lg font-medium px-2'>This Week</h2>
        <AreaChart
          className='h-64 text-[10px] mt-1'
          data={chartData}
          categories={['Sales', 'Expense']}
          index='Week'
          colors={['sky', 'yellow']}
          valueFormatter={(number: number) =>
            `₹ ${Intl.NumberFormat('us').format(number).toString()}`
          }
          yAxisWidth={60}
          showGridLines={false}
          showTooltip={false}
          curveType='monotone'
        />
      </Card>
    </div>
  )
}
