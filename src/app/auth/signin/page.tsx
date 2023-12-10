import GoogleSignInBtn from '@/components/google-signIn-btn'
import Image from 'next/image'
import streamlineVector from '@/svgs/streamline-vector.svg'

const SignIn = () => {
  return (
    <div className='w-full h-screen'>
      <div className='border border-zinc-200/30 max-w-md h-[90%] w-full absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-3xl shadow-xl p-8 flex flex-col justify-between bg-zinc-600/20'>
        <h1 className='text-2xl font-bold'>ENCE</h1>
        <div className='h-1/2 flex justify-center items-center'>
          <Image src={streamlineVector} height={200} alt='inv-vector' />
        </div>
        <div className='w-full text-center rounded-lg mx-auto py-3 px-2'>
          <h1 className='text-xl leading-6 font-bold'>
            Revolutionizing Business Transactions, Where Simplicity Meets
            Efficiency.
          </h1>
          <p className='text-xs mt-2 text-zinc-400 max-w-xs mx-auto'>
            Empower Your Business with Seamless Invoicing, Instant Digital
            Receipts, and Intelligent Insights.
          </p>
        </div>
        <GoogleSignInBtn />
      </div>
    </div>
  )
}

export default SignIn
