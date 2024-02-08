import InputPullback from '@/components/inputPullback'
import { Skeleton } from '@/components/ui/skeleton'
import { OrganizationAddress } from '@/types/organization'
import { Organization } from 'database'
// Todo: remove sampleDetails
const BusinessInfo = ({
  organizationDetails,
  loading
}: {
  organizationDetails: Organization | undefined
  loading: boolean
}) => {
  const orgsAddress: OrganizationAddress = organizationDetails?.address
    ? JSON.parse(organizationDetails?.address.toString())
    : null

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
      </div>
    </>
  )
}
