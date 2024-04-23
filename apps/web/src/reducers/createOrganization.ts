import { OrganizationAction, OrganizationState } from '@/types/organization'

export const OrganizationInitialState: OrganizationState = {
  orgName: null,
  whatsApp: null,
  website: null,
  businessRegistrationNumber: null,
  currencyType: null,
  email: null,
  gstin: null,
  pan: null,
  businessType: null,
  city: null,
  country: null,
  pincode: null,
  state: null
}

export const organizationReducers = (
  state: OrganizationState,
  action: OrganizationAction
) => {
  switch (action.type) {
    case 'UPDATE_ORG_NAME':
      return { ...state, ...action.payload }

    case 'UPDATE_WHATSAPP':
      return { ...state, ...action.payload }

    case 'UPDATE_WEBSITE':
      return { ...state, ...action.payload }

    case 'UPDATE_BUSINESS_REGISTRATION_NUMBER':
      return { ...state, ...action.payload }

    case 'UPDATE_EMAIL':
      return { ...state, ...action.payload }

    case 'UPDATE_GSTIN':
      return { ...state, ...action.payload }

    case 'UPDATE_PAN':
      return { ...state, ...action.payload }

    case 'UPDATE_BUSINESS_TYPE':
      return { ...state, ...action.payload }

    case 'UPDATE_CITY':
      return { ...state, ...action.payload }

    case 'UPDATE_PINCODE':
      return { ...state, ...action.payload }

    case 'UPDATE_STATE':
      return { ...state, ...action.payload }

    case 'UPDATE_COUNTRY':
      return { ...state, ...action.payload }

    case 'UPDATE_CURRENCY':
      return { ...state, ...action.payload }

    default:
      return state
  }
}
