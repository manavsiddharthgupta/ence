import Image from 'next/image'
import bizCon from '@/svgs/biz-con.svg'
import OnboardingTabs from './tabs'
import { redis } from '@/lib/redis'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

const checkIfOrganizationExist = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      redirect('/auth/signin')
    }
    const key = `user_organization:${session?.user?.email}`
    const organizationExist = await redis.get(key)
    return organizationExist
  } catch (error) {
    console.error('Error while checking if Organization exist', error)
  }
}

const OnBoarding = async () => {
  const orgsExist = await checkIfOrganizationExist()
  if (orgsExist) {
    redirect('/home')
  }
  return (
    <div className='flex justify-between min-h-screen h-full px-8 py-6 max-w-6xl w-full mx-auto'>
      <div className='w-[57%]'>
        <h1 className='font-bold text-xl'>ENCE</h1>
        <h2 className='font-bold text-3xl mt-2'>
          Manage your cashflow, receivable, payable and digitalizing your
          invoicing
        </h2>
        <OnboardingTabs />
      </div>
      <div className='w-2/5 rounded-3xl flex items-end'>
        <Image src={bizCon} alt='biz-con' width={450} priority />
      </div>
    </div>
  )
}

export default OnBoarding
