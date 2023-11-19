import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip
} from '@nextui-org/react'
import { Button } from '@/components/ui/button'
import { Mail, Download, MessageCircle } from 'lucide-react'
import React from 'react'

const PreviewModal = () => {
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className='flex justify-between items-center'>
            <p className='font-bold text-3xl'>
              Invoice
              <span className='text-lg font-medium ml-2'>#inv-25725</span>
            </p>
            <div className='mr-6 flex gap-3'>
              <IconCard tipMessage='Download Invoice'>
                <Download className='w-3.5 h-3.5' />
              </IconCard>
              <IconCard tipMessage='Send Mail'>
                <Mail className='w-3.5 h-3.5' />
              </IconCard>
              <IconCard tipMessage='Send Whatsapp'>
                <MessageCircle className='w-3.5 h-3.5' />
              </IconCard>
            </div>
          </ModalHeader>
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button
              className='dark:bg-zinc-900 dark:hover:bg-zinc-800/50 dark:border-zinc-700 border-zinc-200'
              variant='outline'
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  )
}

export default PreviewModal

const IconCard = ({
  children,
  tipMessage
}: {
  children: React.ReactNode
  tipMessage: string
}) => {
  return (
    <Tooltip showArrow={true} content={tipMessage} size='sm'>
      <div className='p-2 rounded-full dark:bg-zinc-900 dark:hover:bg-zinc-800/50 dark:border-zinc-700 border-zinc-200 border cursor-pointer hover:bg-zinc-100'>
        {children}
      </div>
    </Tooltip>
  )
}
