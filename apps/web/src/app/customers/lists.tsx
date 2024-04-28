'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  BookUser,
  ChevronLeftIcon,
  ChevronRightIcon,
  User2Icon
} from 'lucide-react'
import { useState } from 'react'

type CustomerInfo = {
  id: string
  legalName: string
  whatsAppNumber: string
  email: string
}

const CustomerTable = ({ lists: customers }: { lists: CustomerInfo[] }) => {
  const [currentPage, setPageNumber] = useState(1)
  const customersPerPage = 10
  const itemOffset = (currentPage - 1) * customersPerPage
  const endOffset = itemOffset + customersPerPage
  const currentCustomers = customers?.slice(itemOffset, endOffset)
  const pageCount = customers
    ? Math.ceil(customers.length / customersPerPage)
    : 0

  const onHandleNextButton = () => {
    if (currentPage === pageCount) {
      return
    }
    setPageNumber((state) => {
      return state + 1
    })
  }

  const onHandlePreviousButton = () => {
    if (currentPage === 1) {
      return
    }
    setPageNumber((state) => {
      return state - 1
    })
  }

  return (
    <>
      <div className='dark:bg-zinc-800/10 bg-zinc-100/20 border-[1px] dark:border-zinc-700/60 border-zinc-300/60 px-4 py-2 rounded-2xl'>
        <table className='w-full text-black dark:text-white'>
          <thead>
            <tr className='text-sm font-medium text-zinc-600/60 dark:text-zinc-400/70 border-b-[1px] border-zinc-200 dark:border-zinc-700/40'>
              <td className='p-3 w-[10%]'>#</td>
              <td className='p-2 w-[25%]'>Legal Name</td>
              <td className='p-2 w-[30%] text-center'>Phone Number</td>
              <td className='p-2 w-[30%] text-center'>Email</td>
              <td className='p-2 w-[5%]'></td>
            </tr>
          </thead>
          <CustomerBody customers={currentCustomers} />
        </table>
        {customers?.length === 0 && (
          <div className='my-8 text-center w-full'>
            <BookUser className='mx-auto' strokeWidth={0.25} size={45} />
            <p className='text-xs font-light text-black dark:text-white max-w-[200px] mx-auto mt-1'>
              There are no customers to display at the moment. You're all caught
              up!
            </p>
          </div>
        )}
      </div>{' '}
      {customers?.length > 0 && (
        <PaginationUI
          currentPage={currentPage}
          pageCount={pageCount}
          onHandleNextButton={onHandleNextButton}
          onHandlePreviousButton={onHandlePreviousButton}
        />
      )}
    </>
  )
}

export default CustomerTable

const CustomerBody = ({ customers }: { customers: CustomerInfo[] }) => {
  return (
    <tbody>
      {customers?.map((customer, ind) => {
        return (
          <tr
            key={ind}
            className={`text-xs ${
              ind !== customers?.length - 1
                ? 'border-b-[1px] border-zinc-200 dark:border-zinc-700/40'
                : ''
            }`}
          >
            <td className='p-3 opacity-80'>{ind + 1}</td>
            <td className='p-2'>
              <div className='flex items-center gap-2'>
                <Avatar className='w-6 h-6'>
                  <AvatarImage />
                  <AvatarFallback>
                    <User2Icon size='16px' strokeWidth='1px' />
                  </AvatarFallback>
                </Avatar>
                <span className='font-semibold w-[calc(100%-6)]'>
                  {customer?.legalName || '-'}
                </span>
              </div>
            </td>
            <td className='text-center'>{customer.whatsAppNumber}</td>
            <td className='text-center'>{customer.email}</td>
            <td className=''>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='flex h-8 w-8 p-0 data-[state=open]:bg-zinc-500/10 hover:bg-zinc-500/10'
                  >
                    <DotsHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='start'
                  side='left'
                  className='dark:border-zinc-700/60 border-zinc-300/60 bg-white dark:bg-zinc-950'
                >
                  <DropdownMenuLabel>Customer Action</DropdownMenuLabel>
                  <DropdownMenuSeparator className='bg-zinc-600/20' />
                  <DropdownMenuItem disabled>Update</DropdownMenuItem>
                  <DropdownMenuItem disabled>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        )
      })}
    </tbody>
  )
}

const PaginationUI = ({
  pageCount,
  currentPage,
  onHandleNextButton,
  onHandlePreviousButton
}: {
  pageCount: number
  currentPage: number
  onHandleNextButton: () => void
  onHandlePreviousButton: () => void
}) => {
  return (
    <div className='flex justify-end gap-4 mt-2'>
      <div className='flex w-[100px] items-center justify-center text-sm'>
        Page {currentPage} of {pageCount}
      </div>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          className='h-8 w-8 p-0 dark:bg-zinc-900 dark:hover:bg-zinc-800/50 dark:border-zinc-700 border-zinc-200 border hover:bg-zinc-100'
          onClick={() => onHandlePreviousButton()}
          disabled={currentPage === 1}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0 dark:bg-zinc-900 dark:hover:bg-zinc-800/50 dark:border-zinc-700 border-zinc-200 border hover:bg-zinc-100'
          onClick={() => onHandleNextButton()}
          disabled={currentPage === pageCount}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
