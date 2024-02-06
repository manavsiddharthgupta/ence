import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  isEditing: boolean
  orgName: string
  fullName: string
  emailAddress: string
  profileImage: string | null
  handleOrgNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleFullNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSave: () => void
  handleUpdate: () => void
}

const AccountDetails: React.FC<Props> = ({
  isEditing,
  orgName,
  fullName,
  profileImage,
  emailAddress,
  handleOrgNameChange,
  handleFullNameChange,
  handleSave,
  handleUpdate
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <h1 className='text-base mb-4 font-semibold'>Your Profile</h1>
      {isEditing ? (
        <div className='p-5 space-y-2'>
          <Input
            id='orgName'
            type='text'
            value={orgName}
            onChange={handleOrgNameChange}
          />
          <Input
            id='fullName'
            type='text'
            value={fullName}
            onChange={handleFullNameChange}
          />
          <Button onClick={handleSave} variant={'ghost'}>
            Save
          </Button>
        </div>
      ) : (
        <div className='p-5 flex space-x-14 items-center'>
          <div className='space-y-2'>
            {profileImage && (
              <img
                src={profileImage}
                alt='user_display_pic'
                className='rounded-full cursor-pointer'
              />
            )}
            <input
              type='file'
              accept='image/*'
              ref={inputFileRef}
              style={{ display: 'none' }}
            />
            <Button
              onClick={handleUpdate}
              className='bg-green-400 rounded-3xl hover:bg-green-600 text-white font-bold'>
              Add photo
            </Button>
          </div>
          <div className='space-y-2 text-gray-500'>
            <Input id='orgName' type='text' value={orgName} readOnly />
            <Input id='fullName' type='text' value={fullName} readOnly />
            <Button
              onClick={handleUpdate}
              className='bg-green-400 rounded-3xl hover:bg-green-600 text-white font-bold'>
              Update
            </Button>
          </div>
          <div className='space-y-2'>
            <p>Email associated with this account</p>
            <p>{emailAddress}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default AccountDetails
