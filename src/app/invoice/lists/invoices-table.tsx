'use client'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import err from '@/svgs/err.svg'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeftIcon, ChevronRightIcon, User2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { InvoicesResponse } from '@/types/invoice'
import { formatAmount, formatCustomerInfo, formatDate } from '@/lib/helpers'
import TableSkeleton from './table-skeleton'
import Image from 'next/image'
import Filter from './filter'
import createInv from '@/svgs/create-inv.svg'
import { Sheet } from '@/components/ui/sheet'
import Invoice from './invoice'

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<InvoicesResponse[]>([])
  const [selectedInvoice, setInvoiceView] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentPage, setPageNumber] = useState(1)
  const invoicesPerPage = 10
  const itemOffset = (currentPage - 1) * invoicesPerPage
  const endOffset = itemOffset + invoicesPerPage
  const currentInvoices = invoices.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(invoices.length / invoicesPerPage)

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

  useEffect(() => {
    const getInvoices = async () => {
      setLoading(true)
      setError(false)
      const response = await fetch('/api/invoice')
      const invoicesResponse = await response.json()

      if (!invoicesResponse.ok) {
        setError(true)
        setLoading(false)
        return
      }
      setInvoices(invoicesResponse.data)
      setLoading(false)
    }
    getInvoices()
  }, [])

  if (error) {
    return (
      <div className='py-6'>
        <Image
          src={err}
          alt='error'
          width={424}
          height={424}
          className='mx-auto'
        />
      </div>
    )
  }

  const onSelectInvoice = (invoiceId: string) => {
    setInvoiceView(invoiceId)
  }

  const onCloseInvoiceView = () => {
    setInvoiceView(null)
  }
  // revamp code
  return (
    <Sheet open={selectedInvoice! !== null} onOpenChange={onCloseInvoiceView}>
      <div className='my-8'>
        <Filter />
        <InvoiceCard>
          <table className='w-full text-black dark:text-white'>
            <thead>
              <tr className='text-sm font-medium text-zinc-600/60 dark:text-zinc-400/70 border-b-[1px] border-zinc-200 dark:border-zinc-700/40'>
                <td className='p-3 w-[12%]'># Invoice</td>
                <td className='p-2 w-[25%]'>To</td>
                <td className='p-2 w-[13%]'>Issue Date</td>
                <td className='p-2 w-[13%]'>Due Date</td>
                <td className='p-2 w-[10%]'>Status</td>
                <td className='p-2 w-[11%]'>Total</td>
                <td className='p-2 w-[11%]'>Due</td>
                <td className='p-2 w-[5%]'></td>
              </tr>
            </thead>
            <InvoiceBody
              onSelectInvoice={onSelectInvoice}
              invoices={currentInvoices}
              loading={loading}
            />
          </table>
          {!loading && invoices?.length === 0 && <InvoiceEmptyState />}
        </InvoiceCard>
        {!loading && invoices?.length > 0 && (
          <PaginationUI
            currentPage={currentPage}
            pageCount={pageCount}
            onHandleNextButton={onHandleNextButton}
            onHandlePreviousButton={onHandlePreviousButton}
          />
        )}
      </div>
      <Invoice invoiceId={selectedInvoice} />
    </Sheet>
  )
}

export default InvoiceTable

const InvoiceBody = ({
  invoices,
  loading,
  onSelectInvoice
}: {
  invoices: InvoicesResponse[]
  loading: boolean
  onSelectInvoice: (invoiceId: string) => void
}) => {
  return (
    <tbody>
      {!loading ? (
        invoices?.map((invoice, ind) => {
          return (
            <tr
              key={ind}
              className={`text-xs ${
                ind !== invoices?.length - 1
                  ? 'border-b-[1px] border-zinc-200 dark:border-zinc-700/40'
                  : ''
              }`}
            >
              <td className='p-3'>INV-{invoice.invoiceNumber}</td>
              <td className='p-2'>
                <div className='flex items-center gap-2'>
                  <Avatar className='w-6 h-6'>
                    <AvatarImage />
                    <AvatarFallback>
                      <User2Icon size='16px' strokeWidth='1px' />
                    </AvatarFallback>
                  </Avatar>
                  <span className='w-[calc(100%-6)]'>
                    {formatCustomerInfo(invoice.customerInfo)}
                  </span>
                </div>
              </td>
              <td className='p-2'>{formatDate(invoice.dateIssue)}</td>
              <td className='p-2'>{formatDate(invoice.dueDate)}</td>
              <td className='p-2'>
                <StatusBadge status={invoice.paymentStatus} />
              </td>
              <td className='p-2'>{formatAmount(invoice.totalAmount)}</td>
              <td className='p-2'>{formatAmount(invoice.dueAmount)}</td>
              <td className=''>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='flex h-8 w-8 p-0 data-[state=open]:bg-zinc-600/20 hover:bg-zinc-600/10'
                    >
                      <DotsHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='dark:border-zinc-700/60 border-zinc-300/60 bg-white dark:bg-zinc-900'>
                    <DropdownMenuLabel>Invoice Action</DropdownMenuLabel>
                    <DropdownMenuSeparator className='bg-zinc-600/20' />
                    <DropdownMenuItem>Update</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        onSelectInvoice(invoice.id)
                      }}
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className='bg-zinc-600/20' />
                    <DropdownMenuItem>Download</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          )
        })
      ) : (
        <TableSkeleton />
      )}
    </tbody>
  )
}

const InvoiceCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='dark:bg-zinc-600/5 bg-zinc-300/20 border-[1.5px] dark:border-zinc-700/60 border-zinc-300/60 px-4 py-2 rounded-lg'>
      {children}
    </div>
  )
}

const InvoiceEmptyState = () => {
  return (
    <div className='mt-4 mb-8 text-center w-full'>
      <Image
        src={createInv}
        className='mx-auto'
        alt='empty-inv'
        width={256}
        height={232}
      />
      <p className='text-xs font-light text-black dark:text-white max-w-[200px] mx-auto '>
        There are no invoices to display at the moment. You're all caught up!
      </p>
    </div>
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
