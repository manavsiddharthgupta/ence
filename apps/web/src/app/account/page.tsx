import { Separator } from '@/components/ui/separator'
import ConnectApps from './connect-apps'
import BackBtn from '@/components/back-btn'

const Account = () => {
  return (
    <>
      <div className='max-w-3xl mx-auto'>
        <BackBtn />
        <div className='mt-6'>
          <h1 className='text-2xl font-semibold'>Account info</h1>
          <Separator className='h-[0.5px] my-2 dark:bg-zinc-700 bg-zinc-300' />
          <div className='p-16'>
            <p className='text-center font-semibold text-xs'>Comming soon</p>
          </div>
        </div>
        <ConnectApps />
      </div>
    </>
  )
}

export default Account
