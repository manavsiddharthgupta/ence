import GoogleSignInBtn from '@/components/google-signIn-btn'

const SignIn = () => {
  return (
    <div className='w-full h-screen'>
      <div className='border border-zinc-200/30 max-w-md h-3/4 w-full absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-3xl shadow-lg p-8'>
        <h1 className='text-2xl font-bold'>ENCE</h1>
        <GoogleSignInBtn />
      </div>
    </div>
  )
}

export default SignIn
