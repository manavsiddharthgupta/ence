import { Badge } from './ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'

export const Beta = () => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            className='italic text-[10px] leading-[10px] px-1.5 pb-[2.5px] dark:bg-zinc-800 hover:dark:bg-zinc-900'
            variant='secondary'
          >
            Beta
          </Badge>
        </TooltipTrigger>
        <TooltipContent className='bg-white dark:bg-zinc-900 dark:border-zinc-800 border-zinc-200 text-xs'>
          <p>This is in beta version</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
