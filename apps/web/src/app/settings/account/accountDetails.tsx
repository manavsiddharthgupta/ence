import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  isEditing: boolean
  orgName: string
  userName: string
  profileImage: string | null
  emailAddress: string
  handleUpdate: () => void
  handleOrgNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleUserNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSave: () => void
}

const AccountDetails: React.FC<Props> = ({
  isEditing,
  orgName,
  userName,
  profileImage,
  emailAddress,
  handleUpdate,
  handleOrgNameChange,
  handleUserNameChange,
  handleSave
}) => {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress)
    toast.success('Email copied to clipboard!', { duration: 2000 })
  }

  const handleSaveClick = async () => {
    try {
      handleSave()
      toast.success('Changes saved successfully!')
    } catch (error) {
      toast.error('Failed to save changes. Please try again later.')
    }
  }

  const renderActionButton = (isEditing: boolean) => {
    if (isEditing) {
      return (
        <Button
          onClick={handleSaveClick}
          className='bg-blue-400 rounded-3xl hover:bg-blue-600 text-white font-bold'>
          Save
        </Button>
      )
    } else {
      return (
        <Button
          onClick={handleUpdate}
          className='bg-green-400 rounded-3xl hover:bg-green-600 text-white font-bold'>
          Update
        </Button>
      )
    }
  }

  return (
    <>
      <h1 className='text-lg font-semibold'>Your Profile</h1>

      <div className='flex p-11'>
        <div className='flex space-x-5'>
          {profileImage && (
            <img
              src={profileImage}
              alt='user_display_pic'
              className='rounded-full cursor-pointer mr-4'
              style={{ width: '100px', height: '100px' }}
            />
          )}
          <div className='space-y-3 text-gray-500'>
            <Input
              value={orgName}
              readOnly={!isEditing}
              onChange={handleOrgNameChange}
            />
            <Input
              value={userName}
              readOnly={!isEditing}
              onChange={handleUserNameChange}
            />
            <div className='mt-2'>
              <div className='mt-2'>{renderActionButton(isEditing)}</div>
            </div>
          </div>
        </div>
        <div className='space-y-2 ml-10'>
          <p className='font-semibold font-sans'>
            Email associated with this account
          </p>
          <div className='flex gap-2'>
            <p className='text-sm'>{emailAddress}</p>
            <CopyIcon
              className='w-[5%] opacity-25 hover:opacity-100 hover:text-blue-700'
              onClick={handleCopyEmail}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountDetails
