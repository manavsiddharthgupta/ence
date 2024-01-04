'use client'
import error from '@/svgs/err.svg'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

const AuthError = () => {
  const searchParams = useSearchParams()

  const cause = searchParams.get('error')
  if (cause === 'AccessDenied') {
    return (
      <div className='w-full h-screen flex flex-col gap-4 justify-center items-center px-4'>
        <div className='w-fit py-6 px-10 border-2 border-zinc-200/30 rounded-2xl bg-zinc-600/20'>
          <Image src={error} height={240} alt='coming_soon' priority />
          <p className='text-zinc-300 w-full max-w-96 mx-auto text-center'>
            While the app is under development, you can join waitlist page
            <a
              className='mx-1 underline inline-block'
              href='https://ence.in/'
              target='_self'
            >
              here
            </a>
            of our application.
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className='w-full h-screen flex flex-col gap-4 justify-center items-center px-4'>
      <Image src={error} height={180} alt='err' priority />
      <p className='text-zinc-400 w-full max-w-80 text-center'>
        Something went wrong please go to auth page. Click
        <a className='mx-1 underline inline-block' href='/api/auth/signin'>
          here
        </a>
      </p>
    </div>
  )
}
export default AuthError
