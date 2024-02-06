import err from '@/svgs/err.svg'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className='flex items-center justify-center h-[88vh]'>
      <Image
        src={err}
        alt='error'
        width={600}
        height={600}
        className='mx-auto'
      />
    </div>
  )
}
