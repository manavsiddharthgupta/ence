import InputPullback from '@/components/inputPullback'

const ItemsInfo = () => {
  return (
    <>
      <h3 className='text-lg'>Items to bill</h3>
      <Item />
      <Item />
      <Item />
    </>
  )
}

const Item = () => {
  const onChangeCus = () => {}
  return (
    <div className='flex mb-4 mt-2 gap-8 w-full'>
      <div className='w-[48%]'>
        <InputPullback
          value={''}
          type='text'
          onChange={onChangeCus}
          placeholder='Item'
        />
      </div>
      <div className='w-[12%]'>
        <InputPullback
          value={0}
          type='number'
          onChange={onChangeCus}
          placeholder='Quantity'
        />
      </div>
      <div className='w-[12%]'>
        <InputPullback
          value={0}
          type='number'
          onChange={onChangeCus}
          placeholder='Price'
        />
      </div>
      <div className='w-[12%]'>
        <InputPullback
          value={0}
          type='number'
          onChange={onChangeCus}
          placeholder='Total'
        />
      </div>
    </div>
  )
}
export default ItemsInfo
