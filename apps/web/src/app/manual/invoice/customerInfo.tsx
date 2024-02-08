'use client'
import InputCombobox from '@/components/customer-combobox'
import { CustomerForm } from '@/components/customer-form'
import { useInvoiceContext } from '@/context/invoice'
import { Option } from '@/types/invoice'
import { useEffect, useState } from 'react'

const CustomerInfo = () => {
  const [customers, setCustomers] = useState<Option[]>([])
  const {
    customerInfoState,
    customerInfoDispatch,
    customerLegalName,
    setCustomerLegalName
  } = useInvoiceContext()

  useEffect(() => {
    const getCustomers = async () => {
      const res = await fetch('/api/customer')
      const resData = await res.json()
      const customersData = await resData.data
      setCustomers(customersData)
    }
    getCustomers()
  }, [])

  // useEffect(() => {
  //   // set Customer Info using Id
  //   // searching for db will be from db
  //   const ifCustomerExist = people.find((each) => {
  //     return JSON.stringify(each) === JSON.stringify(customerLegalName)
  //   })
  //   if (ifCustomerExist) {
  //     customerInfoDispatch({
  //       type: 'CUSTOMER_SET_ALL',
  //       payload: {
  //         email: sampleCustomerDetails[0]?.email,
  //         whatsappNumber: sampleCustomerDetails[0]?.whatsappNumber,
  //         city: sampleCustomerDetails[0]?.city,
  //         pincode: sampleCustomerDetails[0]?.pincode,
  //         state: sampleCustomerDetails[0]?.state,
  //         country: sampleCustomerDetails[0]?.country
  //       }
  //     }) // adding sample Data
  //   } else {
  //     customerInfoDispatch({
  //       type: 'CUSTOMER_SET_ALL',
  //       payload: {
  //         email: null,
  //         whatsappNumber: null,
  //         city: null,
  //         pincode: null,
  //         state: null,
  //         country: null
  //       }
  //     })
  //   }
  // }, [customerLegalName])

  return (
    <>
      <h3 className='text-lg'>Customer info</h3>
      <div className='mt-2 flex flex-col gap-4'>
        <InputCombobox
          selectedValue={customerLegalName}
          setSelectedValue={setCustomerLegalName}
          options={customers}
        />
      </div>
      <CustomerForm />
    </>
  )
}

export default CustomerInfo
