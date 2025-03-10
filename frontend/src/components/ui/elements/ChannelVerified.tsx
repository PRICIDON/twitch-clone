import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/tw-merge'
import { Check } from 'lucide-react'

const channelVerifiedSizes=cva("", {
	variants: {
		size: {
			sm: 'size-3',
			default: 'size-4',
		}
	},
	defaultVariants: {
		size: 'default'
	}
})

interface channelVerifiedProps extends VariantProps<typeof channelVerifiedSizes> {}

export function ChannelVerified({size} : channelVerifiedProps) {
	return (
		<span className={cn("flex items-center justify-center rounded-full bg-primary p-0.5", channelVerifiedSizes({size}))}>
			<Check className={cn('stroke-[4px] text-white p-[3px]', size === 'sm' ? 'size-2' :'size-4')} />
		</span>
	)
}
