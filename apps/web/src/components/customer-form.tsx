import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Customer } from '@/types/invoice'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const CustomerForm = () => {
  const [legalName, setLegalName] = useState<string | undefined>()
  const [whatsAppNumber, setWhatsApp] = useState<string | undefined>()
  const [email, setEmail] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const onCreateCustomer = async () => {
    if (!legalName || !email || !whatsAppNumber) {
      toast.error('Invalid customer data')
      return
    }
    const emailSchema = z.string().email()
    const numberSchema = z.string().min(10).max(30)
    try {
      emailSchema.parse(email)
    } catch (err) {
      toast.error('Invalid email id')
      return
    }

    try {
      numberSchema.parse(whatsAppNumber + '')
    } catch (err) {
      toast.error('Invalid whatsapp number')
      return
    }
    setLoading(true)
    const body: Customer = {
      email: email,
      legalName: legalName,
      whatsAppNumber: whatsAppNumber
    }
    const response = await fetch('/api/customer', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    const customerRes = await response.json()
    if (customerRes.ok) {
      toast.success('🎉 Customer created successfully!')
      setEmail(undefined)
      setWhatsApp(undefined)
      setLegalName(undefined)
    } else {
      toast.error('Something went wrong while creating customer')
    }
    setLoading(false)
  }
  return (
    <SheetContent className='w-full sm:max-w-lg'>
      <SheetHeader>
        <SheetTitle>Create Customer</SheetTitle>
        <SheetDescription>
          Fill in the field and click create to create customer profile.
        </SheetDescription>
      </SheetHeader>
      <div className='grid gap-4 py-4'>
        <div className='grid grid-cols-3 items-center gap-4'>
          <Label htmlFor='name' className='text-right col-span-1'>
            Legal name
          </Label>
          <Input
            id='name'
            value={legalName || ''}
            onChange={(e) => {
              setLegalName(e.target.value)
            }}
            type='text'
            className='col-span-2 border-[1px] dark:border-zinc-600/30 border-zinc-400/30 bg-transparent outline-none rounded-md remove-arrow'
          />
        </div>
        <div className='grid grid-cols-3 items-center gap-4'>
          <Label htmlFor='email' className='text-right col-span-1'>
            Email
          </Label>
          <Input
            id='email'
            value={email || ''}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            type='email'
            className='col-span-2 border-[1px] dark:border-zinc-600/30 border-zinc-400/30 bg-transparent outline-none rounded-md remove-arrow'
          />
        </div>
        <div className='grid grid-cols-3 items-center gap-4'>
          <Label htmlFor='num' className='text-right col-span-1'>
            WhatsApp Number
          </Label>
          <Input
            id='num'
            value={whatsAppNumber || ''}
            onChange={(e) => {
              setWhatsApp(e.target.value)
            }}
            type='number'
            className='col-span-2 border-[1px] dark:border-zinc-600/30 border-zinc-400/30 bg-transparent outline-none rounded-md remove-arrow'
          />
        </div>
      </div>
      <SheetFooter>
        <Button
          onClick={onCreateCustomer}
          className='rounded-full'
          type='submit'
          disabled={loading}
        >
          {loading && <Loader size={18} className='animate-spin mr-1.5' />}
          Create
        </Button>
      </SheetFooter>
    </SheetContent>
  )
}
