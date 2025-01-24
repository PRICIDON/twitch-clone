import { cva, type VariantProps } from 'class-variance-authority'
import { FindProfileQuery } from '@/graphql/generated/output'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar'
import { cn } from '@/utils/tw-merge'
import { getMediaSource } from '@/utils/get-media-source'

const avatarSizes=cva("", {
	variants: {
		size: {
			sm: 'size-7',
			default: 'size-9',
			lg: 'size-14',
			xl: 'size-32'
		}
	},
	defaultVariants: {
		size: 'default'
	}
})

interface ChannelAvatarProps extends VariantProps<typeof avatarSizes> {
	channel: Pick<FindProfileQuery['findProfile'], 'username' | 'avatar'>
	isLive?: boolean
}

export function ChannelAvatar({channel,size,isLive} : ChannelAvatarProps) {
	return <div className="relative">
		<Avatar className={cn(avatarSizes({size}), isLive && 'ring-2 ring-rose-500')}>
			<AvatarImage src={getMediaSource(channel.avatar!)} alt={channel.username} className="object-cover" />
			<AvatarFallback className={cn(
						size === 'xl' && 'text-4xl',
						size === 'lg' && 'text-2xl'
					)}>{channel.username[0]}</AvatarFallback>
		</Avatar>
	</div>
}
