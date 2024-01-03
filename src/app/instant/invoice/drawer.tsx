import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import Image from 'next/image'

const InstantDrawer = ({ blobUrl }: { blobUrl: string | null }) => {
  return (
    <Drawer open={blobUrl !== null} dismissible={false}>
      <DrawerContent>
        <div className='mx-auto w-full max-w-3xl min-h-[480px]'>
          <DrawerHeader>
            <DrawerTitle className='text-black text-2xl dark:text-white'>
              Create Instant Invoice
            </DrawerTitle>
            <DrawerDescription className='text-zinc-600 dark:text-zinc-400'>
              Validate and edit the invoice here.
            </DrawerDescription>
          </DrawerHeader>
          <div className='p-4 flex gap-4 justify-between'>
            <div>
              <p className='text-xs font-medium'>coming soon...</p>
            </div>
            <div>
              {blobUrl && (
                <Image
                  src={blobUrl}
                  blurDataURL={blobUrl}
                  width='0'
                  height='0'
                  sizes='100vw'
                  className='rounded-xl'
                  style={{ width: '200px', height: 'auto' }}
                  alt='alt'
                  placeholder='blur'
                />
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default InstantDrawer
