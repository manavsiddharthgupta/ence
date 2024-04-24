import { CurrencyType } from 'database'

export type OrganizationState = {
  orgName: string | null
  whatsApp: bigint | null
  website: string | null
  businessRegistrationNumber: string | null
  currencyType: CurrencyType | null
  email: string | null
  gstin: string | null
  pan: string | null
  businessType: 'MANUFACTURING' | 'RETAIL' | 'SERVICE' | null
  city: string | null
  pincode: number | null
  state: string | null
  country: string | null
}

export interface OrganizationAction {
  type: string
  payload: object
}

export type OrganizationBody = {
  orgName: string
  whatsApp: bigint | null
  website: string | null
  businessRegistrationNumber: string | null
  currencyType: CurrencyType
  email: string | null
  gstin: string | null
  pan: string | null
  businessType: 'MANUFACTURING' | 'RETAIL' | 'SERVICE' | null
  address: string
}

export type OrganizationAddress = {
  city: string | null
  pincode: string | number | null
  state: string | null
  country: string | null
}
