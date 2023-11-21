import InputPullback from '@/components/inputPullback'

const BusinessInfo = () => {
  return (
    <>
      <h3 className='text-lg'>Business info</h3>
      <div className='mt-2 flex flex-col gap-4'>
        <InputPullback
          value={'Test Name'}
          type='text'
          placeholder='Legal Name'
          readonly={true}
        />
        <InputPullback
          value={9876543210}
          type='number'
          placeholder='Whatsapp Number'
          readonly={true}
        />
        <InputPullback
          value={'test@business.com'}
          type='text'
          placeholder='Email'
          readonly={true}
        />
      </div>
      <div className='w-full flex mt-4 justify-between'>
        <div className='w-[48%]'>
          <InputPullback
            value={101010}
            type='number'
            placeholder='Pincode'
            readonly={true}
          />
        </div>
        <div className='w-[48%]'>
          <InputPullback
            value={'Sample City'}
            type='text'
            placeholder='City'
            readonly={true}
          />
        </div>
      </div>
      <div className='w-full flex mt-4 justify-between'>
        <div className='w-[48%]'>
          <InputPullback
            value={'Sample City'}
            type='text'
            placeholder='State'
            readonly={true}
          />
        </div>
        <div className='w-[48%]'>
          <InputPullback
            value={'India'}
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
