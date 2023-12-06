import InputPullback from '@/components/inputPullback'
import { Skeleton } from '@/components/ui/skeleton'
import { OrganizationAddress } from '@/types/organization'
import { Organization } from '@prisma/client'
import { useEffect, useState } from 'react'
// Todo: remove sampleDetails
const BusinessInfo = () => {
  const [organizationDetails, setOrganizationDetails] = useState<Organization>()
  const [loading, setLoading] = useState(false)

  const orgsAddress: OrganizationAddress = organizationDetails?.address
    ? JSON.parse(organizationDetails?.address.toString())
    : null
  useEffect(() => {
    const getOrgDetails = async () => {
      setLoading(true)
      const response = await fetch('/api/organization')
      const organizationRes = await response.json()
      if (!organizationRes.ok) {
        setOrganizationDetails(undefined)
        setLoading(false)
        return
      }
      setOrganizationDetails(organizationRes.data)
      setLoading(false)
    }
    getOrgDetails()
  }, [])

  if (loading) {
    return <BusinessSkeleton />
  }
  return (
    <>
      <h3 className='text-lg'>Business info</h3>
      <div className='mt-2 flex flex-col gap-4'>
        <InputPullback
          value={organizationDetails?.orgName || '-'}
          type='text'
          placeholder='Legal Name'
          readonly={true}
        />
        <InputPullback
          value={
            organizationDetails?.whatsappNumber?.toString() === '0'
              ? ''
              : organizationDetails?.whatsappNumber?.toString() || ''
          }
          type='number'
          placeholder='Whatsapp Number'
          readonly={true}
        />
        <InputPullback
          value={organizationDetails?.email || '-'}
          type='text'
          placeholder='Email'
          readonly={true}
        />
      </div>
      <div className='w-full flex mt-4 justify-between'>
        <div className='w-[48%]'>
          <InputPullback
            value={orgsAddress?.pincode || ''}
            type='number'
            placeholder='Pincode'
            readonly={true}
          />
        </div>
        <div className='w-[48%]'>
          <InputPullback
            value={orgsAddress?.city || '-'}
            type='text'
            placeholder='City'
            readonly={true}
          />
        </div>
      </div>
      <div className='w-full flex mt-4 justify-between'>
        <div className='w-[48%]'>
          <InputPullback
            value={orgsAddress?.state || '-'}
            type='text'
            placeholder='State'
            readonly={true}
          />
        </div>
        <div className='w-[48%]'>
          <InputPullback
            value={orgsAddress?.country || '-'}
            type='text'
            placeholder='Country'
            readonly={true}
          />
        </div>
      </div>
    </>
  )
}

export default BusinessInfo

const BusinessSkeleton = () => {
  return (
    <>
      <h3 className='text-lg'>Business info</h3>
      <div className='mt-2 flex flex-col gap-4'>
        <Skeleton className='rounded-md h-10 bg-gray-500/10' />
        <Skeleton className='rounded-md h-10 bg-gray-500/10' />
        <Skeleton className='rounded-md h-10 bg-gray-500/10' />
        <Skeleton className='rounded-md h-10 bg-gray-500/10' />
        <Skeleton className='rounded-md h-10 bg-gray-500/10' />
      </div>
    </>
  )
}
