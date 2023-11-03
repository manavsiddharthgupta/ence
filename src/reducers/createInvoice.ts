import { CustomerInfoAction, CustomerInfoState } from '@/types/invoice'

export const customerInfoInitialState: CustomerInfoState = {
  email: '',
  whatsappNumber: '',
  city: '',
  pincode: '',
  state: '',
  country: ''
}

export const customerInfoReducers = (
  state: CustomerInfoState,
  action: CustomerInfoAction
) => {
  switch (action.type) {
    case 'CUSTOMER_EMAIL':
      return {
        ...state,
        email: action.payload
      }
    case 'CUSTOMER_WHATSAPP_NUMBER':
      return {
        ...state,
        whatsappNumber: action.payload
      }
    case 'CUSTOMER_CITY':
      return {
        ...state,
        city: action.payload
      }
    case 'CUSTOMER_PINCODE':
      return {
        ...state,
        pincode: action.payload
      }
    case 'CUSTOMER_STATE':
      return {
        ...state,
        state: action.payload
      }
    case 'CUSTOMER_COUNTRY':
      return {
        ...state,
        country: action.payload
      }
    default:
      return state
  }
}
