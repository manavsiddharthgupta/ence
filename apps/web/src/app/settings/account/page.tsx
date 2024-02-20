'use client'

import React, { useState } from 'react'
import SidebarItem from './sidebar'
import { ChevronRight, Loader2, AlertTriangle } from 'lucide-react'
import AccountDetails from './accountDetails'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import OrganizationDetails from './organizationDetails'

const AccountPage = () => {
  const [selectedItem, setSelectedItem] = useState('Account Details')
  const [isEditing, setIsEditing] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [userName, setUserName] = useState('')

  const {
    isLoading,
    error,
    data: userDetails
  } = useQuery({
    queryKey: ['accountDetails'],
    queryFn: fetchAccountDetails
  })

  async function fetchAccountDetails() {
    const response = await fetch('/api/account')
    if (!response.ok) {
      throw new Error('Failed to fetch account details')
    }
    const userDetailsResponse = await response.json()
    setOrgName(userDetailsResponse.data.orgName)
    setUserName(userDetailsResponse.data.name)
    return userDetailsResponse.data
  }

  if (error) {
    return (
      <ErrorCard
        title='Something went wrong :('
        description={error?.message || 'Please try again later.'}
      />
    )
  }

  if (isLoading || !userDetails) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='flex gap-2 items-center'>
          <Loader2 className='animate-spin' />
          <p className='font-medium'>Fetching Account Details</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (selectedItem === 'Account Details') {
      return (
        <AccountDetails
          isEditing={isEditing}
          orgName={orgName}
          userName={userName}
          profileImage={userDetails?.profilePic}
          emailAddress={userDetails?.email}
          handleUpdate={handleUpdate}
          handleOrgNameChange={handleOrgNameChange}
          handleUserNameChange={handleUserNameChange}
          handleSave={handleSave}
        />
      )
    }

    if (selectedItem === 'Organization Details') {
      return (
        <OrganizationDetails
          isEditing={isEditing}
          orgName={orgName}
          userName={userName}
          handleUpdate={handleUpdate}
          handleOrgNameChange={handleOrgNameChange}
          handleUserNameChange={handleUserNameChange}
          handleSave={handleSave}
        />
      )
    }

    return null
  }

  const handleOrgNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrgName(event.target.value)
  }

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        body: JSON.stringify({
          organizationName: orgName,
          userName
        })
      })
      if (response.ok) {
        setIsEditing(false)
      } else {
        console.error('Failed to save account details:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving account details:', error)
    }
  }

  const handleUpdate = () => {
    setIsEditing(true)
  }

  return (
    <>
      <div className='space-y-1'>
        <div className='flex items-center text-sm font-medium leading-none '>
          <p className='text-3xl font-serif'>Account</p>
          <p className='dark:text-white mt-1'>
            <ChevronRight />
          </p>
          <p className='text-2xl'>{selectedItem}</p>
        </div>
      </div>
      <Separator className='my-4' />

      <div className='flex'>
        <div className='w-44 h-40'>
          <ul>
            <SidebarItem
              label='Account Details'
              selected={selectedItem === 'Account Details'}
              onClick={() => setSelectedItem('Account Details')}
            />
            <SidebarItem
              label='Organization Details'
              selected={selectedItem === 'Organization Details'}
              onClick={() => setSelectedItem('Organization Details')}
            />
          </ul>
        </div>
        <Separator orientation='vertical' className='mx-4' />
        {userDetails && (
          <div className='p-4 border rounded-md dark:shadow-zinc-800'>
            {renderContent()}
          </div>
        )}
      </div>
    </>
  )
}

export default AccountPage

const ErrorCard = ({
  title,
  description
}: {
  title: string
  description: string
}) => {
  return (
    <div className='w-fit bg-white min-w-[320px]'>
      <Alert variant='destructive'>
        <AlertTriangle size={18} />
        <AlertTitle className='text-sm'>{title}</AlertTitle>
        <AlertDescription className='text-xs'>{description}</AlertDescription>
      </Alert>
    </div>
  )
}
