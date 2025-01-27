import type { PropsWithChildren } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/common/tooltip'

interface HintProps {
	label: string
	side?: 'top' | 'bottom' | 'left' | 'right'
	align?: 'start' | 'center' | 'end'
}

// @ts-ignore
function Hint({  asChild ,children, label, side, align} : PropsWithChildren<HintProps>) {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
				<TooltipContent className="dark:bg-white text-white bg-[#1f2128] dark:text-[#1f2128]" side={side} align={align}>
					<p className="font-semibold">{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default Hint
