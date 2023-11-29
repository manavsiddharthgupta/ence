'use client'
import { useSearchParams } from 'next/navigation'
const OnBoarding = () => {
  const search = useSearchParams()
  return <p>On Boarding Page {search.get('scn')}</p>
}

export default OnBoarding
