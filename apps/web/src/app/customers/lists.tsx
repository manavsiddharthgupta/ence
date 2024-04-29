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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  BookUser,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader,
  User2Icon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

type CustomerInfo = {
  id: string
  legalName: string
  whatsAppNumber: string
  email: string
}

const CustomerTable = ({ lists: customers }: { lists: CustomerInfo[] }) => {
  const [deleteAlert, setAlertForDelete] = useState(false)
  const [selectedCustomerToDelete, setCustomerToDelete] = useState<
    string | null
  >(null)
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

  const onSelectInvoiceToDelete = (customerId: string) => {
    setCustomerToDelete(customerId)
    setAlertForDelete(true)
  }

  const onCloseDeleteAlertDialog = () => {
    setAlertForDelete(false)
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
          <CustomerBody
            onSelectCustomerToDelete={onSelectInvoiceToDelete}
            customers={currentCustomers}
          />
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
      <Dialog open={deleteAlert} onOpenChange={onCloseDeleteAlertDialog}>
        <DeleteAlert
          customerInfo={currentCustomers.find((value) => {
            return value.id === selectedCustomerToDelete
          })}
          onCloseAlertDialog={onCloseDeleteAlertDialog}
        />
      </Dialog>
    </>
  )
}

export default CustomerTable

const CustomerBody = ({
  customers,
  onSelectCustomerToDelete
}: {
  customers: CustomerInfo[]
  onSelectCustomerToDelete: (customerId: string) => void
}) => {
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
                  <DropdownMenuItem
                    className='text-red-500 hover:text-red-500'
                    onClick={() => {
                      onSelectCustomerToDelete(customer.id)
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
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

const DeleteAlert = ({
  customerInfo,
  onCloseAlertDialog
}: {
  customerInfo: CustomerInfo | undefined
  onCloseAlertDialog: () => void
}) => {
  const [isDeleting, setDeleting] = useState(false)
  const router = useRouter()

  console.log(customerInfo)
  async function onDeleteInvoice() {
    setDeleting(true)
    try {
      const response = await fetch(`/api/customer/${customerInfo?.id}`, {
        method: 'DELETE'
      })
      const delRes = await response.json()
      if (delRes.ok) {
        toast.success(
          'You successfully deleted customer ' + customerInfo?.legalName,
          {
            position: 'top-right'
          }
        )
        setDeleting(false)
        router.refresh()
        onCloseAlertDialog()
        return
      } else {
        throw new Error(`Error Deleting: ${delRes.data}`)
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error(`Error deleting customer: ${error}`, {
        position: 'top-right'
      })
      setDeleting(false)
    }
  }

  return (
    <DialogContent className='bg-white dark:bg-zinc-950 dark:border-zinc-800 border-zinc-200 max-w-md shadow-sm'>
      <DialogHeader>
        <DialogTitle>Delete customer {customerInfo?.legalName}</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          className='hover:dark:bg-white/5 hover:bg-black/5'
          variant='ghost'
          onClick={onCloseAlertDialog}
        >
          Cancel
        </Button>
        <Button
          disabled={isDeleting}
          className='bg-red-500/10 text-red-500 hover:text-red-600 hover:dark:text-red-400 hover:bg-red-500/20 border-red-300 border'
          onClick={onDeleteInvoice}
        >
          {isDeleting && <Loader size={18} className='animate-spin mr-1.5' />}
          Delete Customer
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
