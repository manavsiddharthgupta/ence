import InputPullback from '@/components/inputPullback'
import { sampleBusinessDetails } from '@/lib/sample'
// Todo: remove sampleDetails
const BusinessInfo = () => {
  return (
    <>
      <h3 className='text-lg'>Business info</h3>
      <div className='mt-2 flex flex-col gap-4'>
        <InputPullback
          value={sampleBusinessDetails.name}
          type='text'
          placeholder='Legal Name'
          readonly={true}
        />
        <InputPullback
          value={sampleBusinessDetails.whatsappNumber}
          type='number'
          placeholder='Whatsapp Number'
          readonly={true}
        />
        <InputPullback
          value={sampleBusinessDetails.email}
          type='text'
          placeholder='Email'
          readonly={true}
        />
      </div>
      <div className='w-full flex mt-4 justify-between'>
        <div className='w-[48%]'>
          <InputPullback
            value={sampleBusinessDetails.pincode}
            type='number'
            placeholder='Pincode'
            readonly={true}
          />
        </div>
        <div className='w-[48%]'>
          <InputPullback
            value={sampleBusinessDetails.city}
            type='text'
            placeholder='City'
            readonly={true}
          />
        </div>
      </div>
      <div className='w-full flex mt-4 justify-between'>
        <div className='w-[48%]'>
          <InputPullback
            value={sampleBusinessDetails.state}
            type='text'
            placeholder='State'
            readonly={true}
          />
        </div>
        <div className='w-[48%]'>
          <InputPullback
            value={sampleBusinessDetails.country}
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
