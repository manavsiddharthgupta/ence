'use client'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import {
  BanknoteIcon,
  BarChart2Icon,
  BookUserIcon,
  ChevronRightCircleIcon,
  InfoIcon,
  ReceiptIcon,
  ServerIcon
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useReducer, Dispatch } from 'react'
import { callErrorToast, formatOrgData } from '@/lib/helpers'
import {
  OrganizationInitialState,
  organizationReducers
} from '@/reducers/createOrganization'
import { OrganizationAction, OrganizationState } from '@/types/organization'

const OnboardingTabs = () => {
  const [currTab, setTabIndex] = useState(1)
  const [orgState, orgDispatch] = useReducer(
    organizationReducers,
    OrganizationInitialState
  )
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const getOrganization = async () => {
      const response = await fetch('/api/organization')
      const orgs = await response.json()
      if (orgs.ok) {
        router.push('/home')
      }
    }
    getOrganization()
  }, [])
  const tabs = [1, 2, 3, 4]
  const search = useSearchParams()
  const router = useRouter()
  const screen = search.get('scn')
  if (!screen) {
    router.replace('/home')
  }

  const onSubmitBusinessData = async () => {
    const formattedOrganization = formatOrgData(orgState)
    setLoading(true)
    const response = await fetch('/api/organization', {
      method: 'POST',
      body: JSON.stringify({ ...formattedOrganization })
    })
    const orgRes = await response.json()
    setLoading(false)
    if (!orgRes.ok) {
      callErrorToast('Organization Not Created')
      return
    }
    router.replace('/home')
  }
  return (
    <>
      <TabsBar tabs={tabs} currTab={currTab} />
      {currTab === 1 ? (
        <ScreenOne orgState={orgState} orgDispatch={orgDispatch} />
      ) : currTab === 2 ? (
        <ScreenTwo orgState={orgState} orgDispatch={orgDispatch} />
      ) : currTab === 3 ? (
        <ScreenThree orgState={orgState} orgDispatch={orgDispatch} />
      ) : (
        <ScreenFour orgState={orgState} orgDispatch={orgDispatch} />
      )}
      <div className='flex justify-end gap-4 mt-4'>
        <Button
          onClick={() => {
            if (currTab === 1) return
            setTabIndex((prev) => prev - 1)
          }}
          disabled={currTab === 1}
          variant='ghost'
          className='hover:bg-transparent hover:text-white'
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (!orgState.orgName) {
              return
            }
            if (currTab === tabs.length) {
              onSubmitBusinessData()
              return
            }
            setTabIndex((prev) => prev + 1)
          }}
          variant='default'
          className='bg-white text-black hover:bg-white rounded-full'
          disabled={loading}
        >
          Continue
          <ChevronRightCircleIcon className='ml-2' />
        </Button>
      </div>
    </>
  )
}

const ScreenOne = ({
  orgState,
  orgDispatch
}: {
  orgState: OrganizationState
  orgDispatch: Dispatch<OrganizationAction>
}) => {
  return (
    <div className='h-[260px] overflow-y-auto px-2'>
      <FeatureCard
        title='Payment'
        description='Streamlining Accounts Receivable ensures swift cash collection, while
          effective handling of Accounts Payable fosters strong supplier
          relationships, optimizing overall cash flow for sustained business
          success.'
        icon={<BanknoteIcon size='28px' />}
      />
      <div className='mb-1.5 mt-8 flex justify-between'>
        <div className='w-[56%]'>
          <Input
            value={orgState.orgName || ''}
            type='text'
            placeholder='Business Name'
            className='bg-transparent border-zinc-700/60'
            onChange={(e) => {
              orgDispatch({
                type: 'UPDATE_ORG_NAME',
                payload: {
                  orgName: e.target.value
                }
              })
            }}
          />
          <p className='text-red-500 mt-0.5 ml-1.5 flex items-center gap-1 h-3'>
            {!orgState.orgName && (
              <>
                <InfoIcon size='8px' />
                <span className='text-[8px]'>Business field required</span>
              </>
            )}
          </p>
        </div>
        <div className='w-[42%]'>
          <Input
            value={orgState.whatsApp?.toString() || ''}
            type='text'
            placeholder='WhatsApp Number'
            className='bg-transparent border-zinc-700/60'
            onChange={(e) => {
              orgDispatch({
                type: 'UPDATE_WHATSAPP',
                payload: {
                  whatsApp: e.target.value
                }
              })
            }}
          />
        </div>
      </div>
      <BusinessType orgState={orgState} orgDispatch={orgDispatch} />
    </div>
  )
}

const ScreenTwo = ({
  orgState,
  orgDispatch
}: {
  orgState: OrganizationState
  orgDispatch: Dispatch<OrganizationAction>
}) => {
  return (
    <div className='h-[260px] overflow-y-auto px-2'>
      <div className='flex gap-3'>
        <FeatureCard
          title='Go Paperless'
          description='Embrace a more efficient and sustainable approach to business by transitioning from traditional paper-based processes to a streamlined digital experience.'
          icon={<ServerIcon size='24px' />}
        />
        <FeatureCard
          title='Instant Insights'
          description='Gain instant insights like track payments, overdue invoices, pending transactions, Witness GST calculations evolve dynamically with each transaction effortlessly'
          icon={<BarChart2Icon size='28px' strokeWidth='4px' />}
        />
      </div>
      <div className='mb-4 mt-8 flex justify-between'>
        <div className='w-[56%]'>
          <Input
            value={orgState.email || ''}
            type='email'
            placeholder='Business Email'
            className='bg-transparent border-zinc-700/60'
            onChange={(e) => {
              orgDispatch({
                type: 'UPDATE_EMAIL',
                payload: {
                  email: e.target.value
                }
              })
            }}
          />
        </div>
        <div className='w-[42%]'>
          <Input
            value={orgState.website || ''}
            type='text'
            placeholder='Website Link'
            className='bg-transparent border-zinc-700/60'
            onChange={(e) => {
              orgDispatch({
                type: 'UPDATE_WEBSITE',
                payload: {
                  website: e.target.value
                }
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

const ScreenThree = ({
  orgState,
  orgDispatch
}: {
  orgState: OrganizationState
  orgDispatch: Dispatch<OrganizationAction>
}) => {
  return (
    <div className='h-[260px] overflow-y-auto px-2'>
      <FeatureCard
        title='Streamline GST payments'
        description='We facilitates seamless handling of GST transactions, reducing errors and saving time. Ensure hassle-free GST payments, fostering regulatory compliance and contributing to the overall efficiency of your business operations.'
        icon={<ReceiptIcon size='26px' />}
      />
      <div className='mb-4 mt-8 flex justify-between'>
        <div className='w-[56%]'>
          <Input
            value={orgState.pan || ''}
            type='text'
            placeholder='Business PAN'
            className='bg-transparent border-zinc-700/60'
            onChange={(e) => {
              orgDispatch({
                type: 'UPDATE_PAN',
                payload: {
                  pan: e.target.value
                }
              })
            }}
          />
        </div>
        <div className='w-[42%]'>
          <Input
            value={orgState.gstin || ''}
            type='text'
            placeholder='Business GSTIN'
            className='bg-transparent border-zinc-700/60'
            onChange={(e) => {
              orgDispatch({
                type: 'UPDATE_GSTIN',
                payload: {
                  gstin: e.target.value
                }
              })
            }}
          />
        </div>
      </div>
      <div className='w-[56%]'>
        <Input
          value={orgState.businessRegistrationNumber || ''}
          type='text'
          placeholder='Business Reg. No.'
          className='bg-transparent border-zinc-700/60'
          onChange={(e) => {
            orgDispatch({
              type: 'UPDATE_BUSINESS_REGISTRATION_NUMBER',
              payload: {
                businessRegistrationNumber: e.target.value
              }
            })
          }}
        />
      </div>
    </div>
  )
}

const ScreenFour = ({
  orgState,
  orgDispatch
}: {
  orgState: OrganizationState
  orgDispatch: Dispatch<OrganizationAction>
}) => {
  return (
    <div className='h-[260px] overflow-y-auto px-2'>
      <FeatureCard
        title='Customer Relationships'
        description='Access comprehensive customer profiles, consolidating contact details, purchase history, communication logs, and more. Build stronger connections by having a comprehensive understanding of each customers journey.'
        icon={<BookUserIcon size='26px' />}
      />
      <div className='mb-4 mt-8 flex justify-between'>
        <div className='w-[49%]'>
          <Input
            value={orgState.city || ''}
            type='text'
            placeholder='City'
            className='bg-transparent border-zinc-700/60'
            onChange={(e) => {
              orgDispatch({
                type: 'UPDATE_CITY',
                payload: {
                  city: e.target.value
                }
              })
            }}
          />
        </div>
        <div className='w-[49%]'>
          <Input
            value={orgState.pincode || ''}
            type='number'
            placeholder='Pincode'
            className='bg-transparent border-zinc-700/60 remove-arrow'
            onChange={(e) => {
              orgDispatch({
                type: 'UPDATE_PINCODE',
                payload: {
                  pincode: e.target.value
                }
              })
            }}
          />
        </div>
      </div>
      <div className='mb-4 flex justify-between'>
        <div className='w-[49%]'>
          <Input
            value={orgState.state || ''}
            type='text'
            placeholder='State'
            className='bg-transparent border-zinc-700/60'
            onChange={(e) => {
              orgDispatch({
                type: 'UPDATE_STATE',
                payload: {
                  state: e.target.value
                }
              })
            }}
          />
        </div>
        <div className='w-[49%]'>
          <Input
            value={orgState.country || ''}
            type='text'
            placeholder='Country'
            className='bg-transparent border-zinc-700/60'
            onChange={(e) => {
              orgDispatch({
                type: 'UPDATE_COUNTRY',
                payload: {
                  country: e.target.value
                }
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

const TabsBar = ({
  tabs,
  currTab
}: {
  tabs: Array<number>
  currTab: number
}) => {
  return (
    <div className='my-6 flex gap-3 items-center'>
      {tabs.map((index) => {
        return (
          <p
            key={index}
            className={`w-10 h-2 rounded-md ${
              index <= currTab ? 'bg-sky-500' : 'bg-zinc-700/80 '
            }`}
          ></p>
        )
      })}
    </div>
  )
}

export default OnboardingTabs

const BusinessType = ({
  orgState,
  orgDispatch
}: {
  orgState: OrganizationState
  orgDispatch: Dispatch<OrganizationAction>
}) => {
  const className =
    'flex flex-col items-center justify-between rounded-md border border-zinc-700/60 bg-zinc-900 p-3 hover:bg-zinc-600/5 text-zinc-400 hover:text-zinc-400 peer-data-[state=checked]:border-zinc-100 [&:has([data-state=checked])]:border-zinc-100 peer-data-[state=checked]:text-zinc-100 [&:has([data-state=checked])]:text-zinc-100'
  return (
    <RadioGroup
      value={orgState.businessType!}
      className='grid grid-cols-3 gap-4'
    >
      <div>
        <RadioGroupItem
          value='RETAIL'
          id='card'
          className='peer sr-only'
          onClick={(e: any) => {
            orgDispatch({
              type: 'UPDATE_BUSINESS_TYPE',
              payload: {
                businessType: e.target.value
              }
            })
          }}
        />
        <Label htmlFor='card' className={className}>
          Retail
        </Label>
      </div>
      <div>
        <RadioGroupItem
          value='SERVICE'
          id='paypal'
          className='peer sr-only'
          onClick={(e: any) => {
            orgDispatch({
              type: 'UPDATE_BUSINESS_TYPE',
              payload: {
                businessType: e.target.value
              }
            })
          }}
        />
        <Label htmlFor='paypal' className={className}>
          Service
        </Label>
      </div>
      <div>
        <RadioGroupItem
          value='MANUFACTURING'
          id='apple'
          className='peer sr-only'
          onClick={(e: any) => {
            orgDispatch({
              type: 'UPDATE_BUSINESS_TYPE',
              payload: {
                businessType: e.target.value
              }
            })
          }}
        />
        <Label htmlFor='apple' className={className}>
          Manufacturing
        </Label>
      </div>
    </RadioGroup>
  )
}

const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => {
  return (
    <div className='border border-zinc-700/60 rounded-lg bg-zinc-600/5 p-4'>
      <div className='flex gap-2 items-center'>
        {icon}
        <h3 className='font-semibold'>{title}</h3>
      </div>
      <p className='text-sm text-zinc-400 mt-1'>{description}</p>
    </div>
  )
}
