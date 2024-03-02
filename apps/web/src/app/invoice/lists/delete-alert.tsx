'use client'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InvoicesResponse } from '@/types/invoice'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const DeleteAlert = ({
  invoice,
  onCloseAlertDialog
}: {
  invoice: InvoicesResponse | undefined
  onCloseAlertDialog: () => void
}) => {
  const [isDeleting, setDeleting] = useState(false)
  const router = useRouter()

  async function onDeleteInvoice() {
    setDeleting(true)
    try {
      const response = await fetch(`/api/invoice/${invoice?.id}`, {
        method: 'DELETE'
      })
      const delRes = await response.json()
      if (delRes.ok) {
        toast.success(
          'You successfully deleted invoice INV-' + invoice?.invoiceNumber,
          {
            position: 'top-right'
          }
        )
        setDeleting(false)
        router.refresh()
        onCloseAlertDialog()
        return
      } else {
        throw new Error(`Error fetching image: ${delRes.data}`)
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      toast.error(`Error deleting invoice: ${error}`, {
        position: 'top-right'
      })
      setDeleting(false)
    }
  }

  return (
    <DialogContent className='bg-white dark:bg-zinc-950 dark:border-zinc-800 border-zinc-200 max-w-md shadow-sm'>
      <DialogHeader>
        <DialogTitle>Delete invoice INV-{invoice?.invoiceNumber}</DialogTitle>
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
          Delete Invoice
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default DeleteAlert
