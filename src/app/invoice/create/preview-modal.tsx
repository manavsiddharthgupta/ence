import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@nextui-org/react'
import { Button } from '@/components/ui/button'

const PreviewModal = () => {
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className='flex flex-col gap-1'>Modal Title</ModalHeader>
          <ModalBody>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              pulvinar risus non risus hendrerit venenatis. Pellentesque sit
              amet hendrerit risus, sed porttitor quam.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              pulvinar risus non risus hendrerit venenatis. Pellentesque sit
              amet hendrerit risus, sed porttitor quam.
            </p>
            <p>
              Magna exercitation reprehenderit magna aute tempor cupidatat
              consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
              incididunt cillum quis. Velit duis sit officia eiusmod Lorem
              aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi
              consectetur esse laborum eiusmod pariatur proident Lorem eiusmod
              et. Culpa deserunt nostrud ad veniam.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className='dark:bg-zinc-900 dark:hover:bg-zinc-800/50'
              variant='ghost'
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className='bg-emerald-600 text-white hover:bg-emerald-700'
              onClick={onClose}
            >
              Send
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  )
}

export default PreviewModal
