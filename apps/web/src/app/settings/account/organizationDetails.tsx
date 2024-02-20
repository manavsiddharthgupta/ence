import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CopyIcon } from 'lucide-react'

interface Props {
  isEditing: boolean
  orgName: string
  userName: string
  handleUpdate: () => void
  handleOrgNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleUserNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSave: () => void
}

const OrganizationDetails: React.FC<Props> = ({
  isEditing,
  orgName,
  userName,
  handleUpdate,
  handleOrgNameChange,
  handleUserNameChange,
  handleSave
}) => {
  return (
    <>
      <h1 className='text-lg font-semibold'>Your Organization </h1>

      <div className='flex p-11'>
        <div className='flex space-x-5'>
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
              {isEditing ? (
                <Button
                  onClick={handleSave}
                  className='bg-blue-400 rounded-3xl hover:bg-blue-600 text-white font-bold'>
                  Save
                </Button>
              ) : (
                <Button
                  onClick={handleUpdate}
                  className='bg-green-400 rounded-3xl hover:bg-green-600 text-white font-bold'>
                  Update
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className='space-y-2 ml-10'>
          <p className='font-semibold font-sans'>
            Email associated with this account
          </p>
          <div className='flex gap-2'>
            {/* <p className='text-sm'>{emailAddress}</p> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default OrganizationDetails
