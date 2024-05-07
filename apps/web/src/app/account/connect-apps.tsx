'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { BadgeCheck, Loader, Plug } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type StripeAccountInfo = {
  apiToken: string
  id: string
  accountId: string
}[]

const ConnectApps = () => {
  return (
    <div>
      <h1 className='text-2xl font-semibold'>Connect apps</h1>
      <Separator className='h-[0.5px] my-2 dark:bg-zinc-700 bg-zinc-300' />
      <div className='flex justify-center items-center mt-12'>
        <ConnectStripe />
      </div>
    </div>
  )
}

export default ConnectApps

const ConnectStripe = () => {
  const [accountInfo, setAccInfo] = useState<StripeAccountInfo | null>(null)
  const [isFetching, setStatus] = useState(true)
  const [isConnected, setConnectedStatus] = useState<boolean>(false)
  const [onIntegrate, setIntegrationStatus] = useState(false)

  const onSetIntegrate = () => {
    setIntegrationStatus(true)
  }

  useEffect(() => {
    setStatus(true)
    const gettingAccountInfo = async () => {
      const response = await fetch('/api/account/connect/stripe')
      const res = await response.json()
      console.log(res)
      if (!res.ok) {
        toast.error('Something went wrong while fetching info.')
        setAccInfo(null)
        setConnectedStatus(false)
      } else {
        if (!res.data || res.data.length === 0) {
          setAccInfo(null)
          setConnectedStatus(false)
        } else {
          setAccInfo(res.data)
          setConnectedStatus(true)
        }
      }
      setStatus(false)
    }
    gettingAccountInfo()
  }, [onIntegrate])

  if (isFetching) {
    return (
      <div className='flex items-center justify-center rounded-md border border-1 dark:border-zinc-700 border-zinc-300 w-full max-w-lg p-6 gap-2'>
        <p className='text-sm font-medium'>Checking Status</p>
        <Loader size={18} className='animate-spin' />
      </div>
    )
  }

  let info = isConnected ? (
    <div className='flex flex-col gap-1 mt-4'>
      <div className='flex gap-4 items-center'>
        <h3 className='font-medium'>Account Id</h3>
        <p className='text-xs'>
          {accountInfo ? accountInfo[0].accountId : '-'}
        </p>
      </div>
      <div className='flex gap-5 items-center'>
        <h3 className='font-medium'>Secret Key</h3>
        <p className='text-xs max-w-20 truncate'>
          {accountInfo ? accountInfo[0].apiToken : '-'}
        </p>
      </div>
    </div>
  ) : null
  return (
    <div className='rounded-md border border-1 dark:border-zinc-700 border-zinc-300 w-full max-w-lg p-6'>
      <div className='flex items-center'>
        <div className='w-1/2 gap-4 flex items-center'>
          <div className='h-7 w-7 flex justify-center items-center rounded-sm bg-violet-600'>
            <h3 className='font-semibold text-xl leading-5 text-white'>S</h3>
          </div>
          <p className='font-medium text-xl'>Stripe</p>
        </div>
        <div className='w-1/2 flex justify-end items-center min-h-9'>
          <Dialog>
            {!isConnected && (
              <DialogTrigger asChild>
                <Button size='sm' disabled={isFetching}>
                  <Plug size={16} strokeWidth={2.5} className='mr-1' />
                  Connect
                </Button>
              </DialogTrigger>
            )}

            {isConnected && (
              <Button
                size='sm'
                className='bg-green-500 text-white hover:bg-green-500 cursor-default'
                variant='secondary'
              >
                <BadgeCheck size={16} strokeWidth={2.5} className='mr-1' />
                Connected
              </Button>
            )}

            <DialogContent className='max-w-md bg-white dark:bg-zinc-950 dark:border-zinc-800 border-zinc-200'>
              <ConnectStripeModal
                isConnected={isConnected}
                onSetIntegrate={onSetIntegrate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {info}
    </div>
  )
}

const ConnectStripeModal = ({
  isConnected,
  onSetIntegrate
}: {
  isConnected: boolean
  onSetIntegrate: () => void
}) => {
  const [apiToken, setApiToken] = useState<string | undefined>()
  const [isAdding, setStripeAccStatus] = useState(false)
  const onAddStripeAccount = async () => {
    if (!apiToken || isConnected) {
      return
    }
    setStripeAccStatus(true)
    const response = await fetch('/api/account/connect/stripe', {
      method: 'POST',
      body: JSON.stringify({ apiToken: apiToken })
    })
    const res = await response.json()
    setStripeAccStatus(false)
    if (res.ok) {
      toast.success('Stripe account integrated successfully!')
      onSetIntegrate()
    } else {
      toast.error('Something went wrong while integrating stripe.')
    }
  }
  return (
    <>
      <DialogTitle>Integrate your stripe account.</DialogTitle>
      <div className='flex flex-col gap-2 my-4'>
        <Label
          className='text-sm font-normal text-zinc-950 dark:text-white w-[130px] text-left'
          htmlFor='api-secret'
        >
          Stripe Api Secret Key
        </Label>
        <Input
          className='w-full border-[1px] outline-none bg-transparent dark:border-zinc-700 border-zinc-200'
          value={apiToken || ''}
          onChange={(e) => {
            setApiToken(e.target.value)
          }}
          type='text'
          id='api-secret'
          placeholder='sk_djssh...'
        />
      </div>
      <Button disabled={isAdding || isConnected} onClick={onAddStripeAccount}>
        {isAdding && <Loader size={18} className='animate-spin mr-1.5' />}
        Add Stripe Account
      </Button>
    </>
  )
}
