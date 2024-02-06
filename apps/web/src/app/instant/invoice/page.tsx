'use client'

import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  FileUp,
  GitCompare,
  Loader2Icon,
  ScanText
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import createInv from '@/svgs/create-inv.svg'
import { useState } from 'react'
import { callErrorToast } from '@/lib/helpers'
import InstantDrawer from './drawer'
import BackBtn from '@/components/back-btn'

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
        <BackBtn />
        <div className='mt-4 flex flex-col gap-4'>
          <div className='h-32 border text-zinc-900 dark:text-zinc-200 dark:border-zinc-700/60 border-zinc-300/60 rounded-lg bg-white dark:bg-zinc-900 p-2 flex items-center justify-around bg-[radial-gradient(black_1px,transparent_0)] dark:bg-[radial-gradient(white_1px,transparent_0)] dot'>
            <div>
              <FileUp size={30} strokeWidth={1.5} className='mx-auto' />
              <p className='font-medium'>UPLOAD</p>
            </div>
            <div>
              <ScanText size={30} strokeWidth={1.5} className='mx-auto' />
              <p className='font-medium'>SCAN</p>
            </div>
            <div>
              <GitCompare size={30} strokeWidth={1.5} className='mx-auto' />
              <p className='font-medium'>VERIFY</p>
            </div>
            <div>
              <CheckCircle size={30} strokeWidth={1.5} className='mx-auto' />
              <p className='font-medium'>DONE</p>
            </div>
          </div>

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
    <div className='h-72 relative'>
      {loading && (
        <div className='absolute top-0 left-0 border border-dashed dark:border-zinc-600 border-zinc-400 bg-zinc-50/95 dark:bg-zinc-800/95 dark:text-white text-black w-full h-full rounded-2xl flex justify-center items-center z-10'>
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
            width={140}
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
