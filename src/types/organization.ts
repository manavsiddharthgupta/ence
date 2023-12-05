export type OrganizationState = {
  orgName: string | null
  whatsApp: string | null
  website: string | null
  businessRegistrationNumber: string | null
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
  whatsApp: number | null
  website: string | null
  businessRegistrationNumber: string | null
  email: string | null
  gstin: string | null
  pan: string | null
  businessType: 'MANUFACTURING' | 'RETAIL' | 'SERVICE' | null
  address: string
}