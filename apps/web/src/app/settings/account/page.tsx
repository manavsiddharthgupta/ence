'use client'

import React, { useState } from 'react'
import SidebarItem from './sidebar'
import { ChevronRight, Loader2, AlertTriangle } from 'lucide-react'
import AccountDetails from './accountDetails'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const AccountPage = () => {
  const [selectedItem, setSelectedItem] = useState('Account Details')
  const [isEditing, setIsEditing] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [userName, setUserName] = useState('')

  const {
    isFetching: isPending,
    error,
    data: userDetails
  } = useQuery({
    queryKey: ['accountDetails'],
    queryFn: () => fetchAccountDetails()
  })

  const fetchAccountDetails = async () => {
    const response = await fetch('/api/account')
    const userDetailsResponse = await response.json()
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

  if (isPending) {
    return (
      <div className='flex gap-2 items-center'>
        <Loader2 className='animate-spin' />
        <p className='font-medium'>Fetching Account Details</p>
      </div>
    )
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
          userName: userName
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
            {/* <SidebarItem
              label='Integration'
              selected={selectedItem === 'Integration'}
              onClick={() => setSelectedItem('Integration')}
            /> */}
          </ul>
        </div>
        <Separator orientation='vertical' className='mx-4' />
        <div className='p-4 border border-r-2 rounded-md shadow-xl dark:shadow-zinc-800'>
          <AccountDetails
            isEditing={isEditing}
            orgName={userDetails?.organizationName}
            userName={userDetails?.userName}
            profileImage={userDetails?.profilePic}
            emailAddress={userDetails?.emailAddress}
            handleUpdate={handleUpdate}
            handleOrgNameChange={handleOrgNameChange}
            handleUserNameChange={handleUserNameChange}
            handleSave={handleSave}
          />
        </div>
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
