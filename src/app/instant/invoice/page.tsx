'use client'

import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import createInv from '@/svgs/create-inv.svg'
import { useState } from 'react'
import { callErrorToast } from '@/lib/helpers'
import InstantDrawer from './drawer'
import HomeBtn from './home-btn'

const InstantInvoice = () => {
  const [blobUrl, setUrl] = useState<string | null>(null)

  const onSetUrl = (url: string) => {
    setUrl(url)
  }

  const onReset = () => {
    setUrl(null)
  }

  return (
    <>
      <div className='max-w-3xl mx-auto'>
        <HomeBtn />
        <div className='mt-4 flex flex-col gap-4'>
          <div className='h-32'></div>
          <InvoiceUploader onSetUrl={onSetUrl} />
        </div>
      </div>
      <InstantDrawer blobUrl={blobUrl} onReset={onReset} />
    </>
  )
}

export default InstantInvoice

const InvoiceUploader = ({ onSetUrl }: { onSetUrl: (url: string) => void }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allowedTypes = ['image/jpeg', 'image/png'] // will add pdf

  const fileValidation = (fileType: string) => {
    if (allowedTypes.includes(fileType)) {
      return true
    }
    callErrorToast('Invalid file type')
    return false
  }

  const onCreateInstantInvoice = async (file: File) => {
    const response = await fetch(`/api/upload/doc?filename=${file.name}`, {
      method: 'POST',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    })
    const newBlob = await response.json()

    if (newBlob.ok) {
      const urlString: string = newBlob.data.url
      onSetUrl(urlString)
      setLoading(false)
      return
    }
    setError('Error while uploading document')
    setLoading(false)
    callErrorToast('Error while scanning document')
  }

  return (
    <div className='h-80 relative'>
      {loading && (
        <div className='absolute top-0 left-0 border border-dashed dark:border-zinc-600 border-zinc-400 bg-zinc-50/95 dark:bg-zinc-800/95 dark:text-white text-black w-full h-full rounded-2xl flex justify-center items-center'>
          <div className='w-fit h-fit flex items-center gap-2 '>
            <Loader2Icon className='animate-spin' />
            <p className='text-sm font-semibold'>Uploading document</p>
          </div>
        </div>
      )}
      <Button
        className='border-dashed bg-transparent dark:border-zinc-600 border-zinc-400 hover:bg-zinc-100/80 hover:dark:bg-zinc-800/50 text-xs font-normal dark:text-zinc-400 text-zinc-600 w-full h-full rounded-2xl'
        variant='outline'
        size='sm'
      >
        <div>
          <Image
            src={createInv}
            className='mx-auto'
            alt='empty-inv'
            width={156}
            priority
          />
          <p className='text-xs font-light text-black dark:text-white max-w-[200px] mx-auto '>
            Drag & Drop files here or click to upload
          </p>
        </div>
      </Button>
      <Input
        value={''}
        onChange={async (e: any) => {
          const file: File = e.target.files[0]
          if (fileValidation(file.type)) {
            setError(null)
            setLoading(true)
            await onCreateInstantInvoice(file)
          }
        }}
        className='h-full absolute top-0 left-0 opacity-0'
        type='file'
        accept='image/x-png,image/jpeg'
      />
    </div>
  )
}
