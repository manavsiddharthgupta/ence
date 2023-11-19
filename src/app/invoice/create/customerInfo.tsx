'use client'
import InputCombobox from '@/components/combobox'
import InputPullback from '@/components/inputPullback'
import { useInvoiceContext } from '@/context/invoice'
import { useEffect, useState } from 'react'

const CustomerInfo = () => {
  const { customerInfoState, customerInfoDispatch } = useInvoiceContext()
  const [customerLegalName, setCustomerLegalName] = useState('')
  useEffect(() => {
    // set Customer Info using Id
    if (customerLegalName) {
      customerInfoDispatch({
        type: 'CUSTOMER_SET_ALL',
        payload: {
          email: 'customer@test.com',
          whatsappNumber: 9876543210,
          city: 'City',
          pincode: '101010',
          state: 'Mumbai',
          country: 'India'
        }
      })
    }
  }, [customerLegalName])
  console.log(customerInfoState, customerLegalName) // Todo: Remove / testing
  const people = [
    { id: 0, value: 'Test Customer' },
    { id: 1, value: 'Wade Cooper' },
    { id: 2, value: 'Arlene Mccoy' },
    { id: 3, value: 'Devon Webb' },
    { id: 4, value: 'Tom Cook' },
    { id: 5, value: 'Tanya Fox' },
    { id: 6, value: 'Hellen Schmidt' }
  ] // Todo: Remove / testing

  const onChangeCustomerWhatsapp = (e: React.ChangeEvent<HTMLInputElement>) => {
    customerInfoDispatch({
      type: 'CUSTOMER_WHATSAPP_NUMBER',
      payload: { whatsappNumber: e.target.value }
    })
  }

  const onChangeCustomerEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    customerInfoDispatch({
      type: 'CUSTOMER_EMAIL',
      payload: { email: e.target.value }
    })
  }

  const onChangeCustomerPincode = (e: React.ChangeEvent<HTMLInputElement>) => {
    customerInfoDispatch({
      type: 'CUSTOMER_PINCODE',
      payload: { pincode: e.target.value }
    })
  }

  const onChangeCustomerCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    customerInfoDispatch({
      type: 'CUSTOMER_CITY',
      payload: { city: e.target.value }
    })
  }

  const onChangeCustomerState = (e: React.ChangeEvent<HTMLInputElement>) => {
    customerInfoDispatch({
      type: 'CUSTOMER_STATE',
      payload: { state: e.target.value }
    })
  }

  const onChangeCustomerCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    customerInfoDispatch({
      type: 'CUSTOMER_COUNTRY',
      payload: { country: e.target.value }
    })
  }

  return (
    <>
      <h3 className='text-lg'>Customer info</h3>
      <div className='mt-2 flex flex-col gap-4'>
        <InputCombobox
          selectedValue={customerLegalName}
          setSelectedValue={setCustomerLegalName}
          options={people}
        />
        <InputPullback
          value={customerInfoState.whatsappNumber}
          type='number'
          onChange={onChangeCustomerWhatsapp}
          placeholder='Customer Whatsapp Number'
        />
        <InputPullback
          value={customerInfoState.email}
          type='text'
          onChange={onChangeCustomerEmail}
          placeholder='Customer Email'
        />
      </div>
      <div className='w-full flex mt-4 justify-between'>
        <div className='w-[48%]'>
          <InputPullback
            value={customerInfoState.pincode}
            type='number'
            onChange={onChangeCustomerPincode}
            placeholder='Pincode'
          />
        </div>
        <div className='w-[48%]'>
          <InputPullback
            value={customerInfoState.city}
            type='text'
            onChange={onChangeCustomerCity}
            placeholder='City'
          />
        </div>
      </div>
      <div className='w-full flex mt-4 justify-between'>
        <div className='w-[48%]'>
          <InputPullback
            value={customerInfoState.state}
            type='text'
            onChange={onChangeCustomerState}
            placeholder='State'
          />
        </div>
        <div className='w-[48%]'>
          <InputPullback
            value={customerInfoState.country}
            type='text'
            onChange={onChangeCustomerCountry}
            placeholder='Country'
          />
        </div>
      </div>
    </>
  )
}

export default CustomerInfo
