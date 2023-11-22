import { Badge } from './ui/badge'

export const StatusBadge = ({ status }: { status: string }) => {
  // will have to revamp the logic
  let className = ''
  switch (status) {
    case 'Paid':
      className = 'bg-emerald-600 hover:bg-emerald-700'
      break
    case 'Pending':
      className = 'bg-yellow-600 hover:bg-yellow-700'
      break
    case 'Unpaid':
      className = 'bg-red-600 hover:bg-red-700'
      break
    case 'Partially':
      className = 'bg-blue-600 hover:bg-blue-700'
      break
    default:
      break
  }
  return <Badge className={'text-white ' + className}>{status}</Badge>
}
