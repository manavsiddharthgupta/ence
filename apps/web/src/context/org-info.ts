import { CurrencyType } from 'database'
import { createContext, Dispatch, useContext } from 'react'

export type ORG_INFO = {
  orgName: string
  avatar: string
  currency_type: CurrencyType | '☒'
  isPro: boolean
}

export type OrgContextType = {
  orgInfo: ORG_INFO
  setOrgInfo: Dispatch<ORG_INFO>
}

export const OrgContext = createContext<OrgContextType>({
  orgInfo: {
    avatar: '',
    currency_type: '☒',
    orgName: '-',
    isPro: false
  },
  setOrgInfo: () => {}
})

export const useOrgInfo = () => useContext(OrgContext)

export const OrgInfoProvider = OrgContext.Provider
