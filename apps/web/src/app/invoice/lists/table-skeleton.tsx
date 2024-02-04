import { Skeleton } from '@/components/ui/skeleton'

const TableSkeleton = () => {
  const skeletonArr = [0, 1, 2, 3, 4, 5, 6, 7]

  return skeletonArr.map((val, ind) => {
    return <RowSkeleton index={ind} row={skeletonArr} key={val} />
  })
}
export default TableSkeleton

const RowSkeleton = ({ index, row }: { index: number; row: Array<number> }) => {
  return (
    <tr
      key={index}
      className={`${
        row.length - 1 !== index
          ? 'border-b-[1px] border-zinc-200 dark:border-zinc-700/40'
          : ''
      }`}
    >
      <td className='p-2'>
        <Skeleton className='rounded-md h-5 bg-gray-500/10' />
      </td>
      <td className='p-2'>
        <Skeleton className='rounded-md h-5 bg-gray-500/10' />
      </td>
      <td className='p-2'>
        <Skeleton className='rounded-md h-5 bg-gray-500/10' />
      </td>
      <td className='p-2'>
        <Skeleton className='rounded-md h-5 bg-gray-500/10' />
      </td>
      <td className='p-2'>
        <Skeleton className='rounded-md h-5 bg-gray-500/10' />
      </td>
      <td className='p-2'>
        <Skeleton className='rounded-md h-5 bg-gray-500/10' />
      </td>
      <td className='p-2'>
        <Skeleton className='rounded-md h-5 bg-gray-500/10' />
      </td>
    </tr>
  )
}
