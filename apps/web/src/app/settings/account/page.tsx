'use client'

import React, { useState, useEffect } from 'react'
import SidebarItem from './sidebar'
import { ChevronRight } from 'lucide-react'
import AccountDetails from './accountDetails'
import IntegrationDetails from './integration'
import { Separator } from '@/components/ui/separator'

const AccountPage = () => {
  const [selectedItem, setSelectedItem] = useState('Account Details')
  const [orgName, setOrgName] = useState('')
  const [fullName, setFullName] = useState('')
  const [profileImage, setProfileImage] = useState('' as string | null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [emailAddress, setEmailAddress] = useState('')

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await fetch('/api/account')
        const userDetailsResponse = await response.json()
        if (userDetailsResponse.ok) {
          setOrgName(userDetailsResponse.data.organizationName)
          setFullName(userDetailsResponse.data.userName)
          setProfileImage(userDetailsResponse.data.profilePic)
          setEmailAddress(userDetailsResponse.data.emailAddress)
        } else {
          console.error(
            'Failed to fetch account details:',
            userDetailsResponse.error
          )
        }
      } catch (error) {
        console.error('Error fetching account details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccountDetails()
  }, [])

  const renderContent = () => {
    if (loading) {
      return <p>Loading account details...</p>
    }

    if (selectedItem === 'Account Details') {
      return (
        <AccountDetails
          isEditing={isEditing}
          orgName={orgName}
          fullName={fullName}
          profileImage={profileImage}
          emailAddress={emailAddress}
          handleOrgNameChange={handleOrgNameChange}
          handleFullNameChange={handleFullNameChange}
          handleSave={handleSave}
          handleUpdate={handleUpdate}
        />
      )
    }

    if (selectedItem === 'Integration') {
      return <IntegrationDetails />
    }

    return null
  }

  const handleOrgNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrgName(event.target.value)
  }

  const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(event.target.value)
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        body: JSON.stringify({
          organizationName: orgName,
          userName: fullName
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
              label='Integration'
              selected={selectedItem === 'Integration'}
              onClick={() => setSelectedItem('Integration')}
            />
          </ul>
        </div>
        <Separator orientation='vertical' className='mx-4' />
        <div className='p-4 bg-gray-200 rounded-md'>{renderContent()}</div>
      </div>
    </>
  )
}

export default AccountPage
