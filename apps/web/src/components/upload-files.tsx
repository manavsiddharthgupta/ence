import { Button } from '@/components/ui/button'
import { PaperclipIcon, Trash2Icon } from 'lucide-react'
import { Input } from './ui/input'
import { useState } from 'react'

const UploadFile = () => {
  const [files, setFiles] = useState<File[]>([])

  const OnDeleteFile = (index: number) => {
    const updateFiles = files?.filter((_, fileIndex) => {
      return index !== fileIndex
    })
    if (updateFiles === undefined) {
      setFiles([])
      return
    }
    setFiles([...updateFiles])
  }
  return (
    <>
      <div className='relative h-14'>
        <Button
          className='border-dashed bg-transparent dark:border-zinc-600 border-zinc-400 hover:bg-zinc-100/80 hover:dark:bg-zinc-800/50 text-xs font-normal dark:text-zinc-400 text-zinc-600 w-full h-full'
          variant='outline'
          size='sm'
        >
          Drag & Drop files here or click to upload
        </Button>
        <Input
          onChange={(e: any) => {
            const allFiles: File[] | null = []
            for (let key of Object.keys(e.target.files)) {
              allFiles.push(e.target.files[key])
            }
            setFiles([...files, ...allFiles])
          }}
          className='h-full absolute top-0 left-0 opacity-0'
          type='file'
          multiple
        />
      </div>
      <div className='mt-2'>
        {files?.map((file, ind) => {
          return (
            <FileUi
              key={ind}
              fileName={file.name}
              onDeleteFile={OnDeleteFile}
              fileIndex={ind}
            />
          )
        })}
      </div>
    </>
  )
}

export default UploadFile

const FileUi = ({
  fileName,
  fileIndex,
  onDeleteFile
}: {
  fileName: string
  fileIndex: number
  onDeleteFile: (index: number) => void
}) => {
  const name =
    fileName.length > 30 ? fileName.substring(0, 31) + '...' : fileName
  return (
    <div className='my-1 border dark:border-zinc-600 border-zinc-400 rounded-md p-2 flex justify-between items-center'>
      <div className='flex gap-2 items-center'>
        <PaperclipIcon
          className='dark:text-zinc-400 text-zinc-600'
          strokeWidth={1.5}
          size={12}
        />
        <p className='text-xs font-light'>{name}</p>
      </div>
      <Trash2Icon
        onClick={() => onDeleteFile(fileIndex)}
        className='cursor-pointer'
        color='red'
        strokeWidth={1.5}
        size={12}
      />
    </div>
  )
}
