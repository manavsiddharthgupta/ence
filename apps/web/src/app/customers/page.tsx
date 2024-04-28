import { Button } from '@/components/ui/button'
import CustomerFilter from './filter'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { CustomerForm } from '@/components/customer-form'
import { Suspense } from 'react'
import { Loader2Icon } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Image from 'next/image'
import err from '@/svgs/err.svg'
import { getCustomers } from '@/crud/customer'
import CustomerTable from './lists'

const CustomerLists = ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : null
  return (
    <Sheet>
      <div className='w-full max-w-4xl mx-auto'>
        <div className='flex justify-between items-center'>
          <div>
            <p className='text-xs leading-3 text-zinc-600/80 dark:text-zinc-300/80 font-medium'>
              Overview
            </p>
            <h1 className='text-4xl leading-9 font-semibold'>Customer Lists</h1>
          </div>
          <SheetTrigger asChild>
            <Button
              className='rounded-full bg-transparent hover:bg-transparent dark:text-white text-black border-2 dark:border-zinc-700/50 border-zinc-300/50 font-semibold'
              variant='default'
            >
              New Customer
            </Button>
          </SheetTrigger>
        </div>

        <div className='my-8'>
          <CustomerFilter />
          <Suspense
            fallback={
              <div className='py-6 w-full flex justify-center'>
                <div className='w-fit h-fit flex items-center gap-2 '>
                  <Loader2Icon className='animate-spin' />
                  <p className='text-sm font-semibold'>Getting customers...</p>
                </div>
              </div>
            }
          >
            <Lists query={search} />
          </Suspense>
        </div>
      </div>
      <CustomerForm />
    </Sheet>
  )
}

export default CustomerLists

const Lists = async ({ query }: { query: string | null }) => {
  const getCustomerLists = async () => {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const response = await getCustomers(email, query)
    return JSON.parse(response)
  }
  const customerLists = await getCustomerLists()
  return (
    <>
      {customerLists.ok ? (
        <CustomerTable lists={customerLists.data} />
      ) : (
        <div className='py-6'>
          <Image
            src={err}
            alt='error'
            width={424}
            height={424}
            className='mx-auto'
          />
        </div>
      )}
    </>
  )
}
