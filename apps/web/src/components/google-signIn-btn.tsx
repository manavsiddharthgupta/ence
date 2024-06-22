'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import google from '@/svgs/google.svg'
import { signIn } from 'next-auth/react'
const GoogleSignInBtn = () => {
  return (
    <Button
      onClick={() =>
        signIn('google', { redirect: true, callbackUrl: '/onboarding?scn=1' })
      }
      variant='secondary'
      className='mt-4 bg-zinc-800 text-white hover:bg-zinc-700'
    >
      <Image src={google} alt='google' width={24} height={24} />
      <span className='ml-2'>Continue With Google</span>
    </Button>
  )
}

export default GoogleSignInBtn
