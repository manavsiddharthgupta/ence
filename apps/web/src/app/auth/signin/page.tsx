import GoogleSignInBtn from '@/components/google-signIn-btn'
import Image from 'next/image'
import streamlineVector from '@/svgs/ence.ico'

const SignIn = () => {
  return (
    <div className='w-full h-screen flex'>
      <div className='md:w-1/2 w-full flex justify-center items-center'>
        <div className='flex flex-col items-center'>
          <div className='py-3'>
            <h1 className='text-3xl px-2 font-bold text-center'>
              Welcome to Ence
            </h1>
            <p className='text-sm mt-4 text-zinc-600 text-center max-w-96 px-2 mx-auto'>
              Empower Your Business with Seamless Invoicing, Instant Digital
              Receipts, and Intelligent Insights.
            </p>
          </div>
          <GoogleSignInBtn />
        </div>
      </div>
      <div className='md:block w-1/2 bg-zinc-800 hidden'>
        <div className='w-full h-full flex justify-center items-center'>
          <Image src={streamlineVector} height={100} alt='inv-vector' />
        </div>
      </div>
    </div>
  )
}

export default SignIn
