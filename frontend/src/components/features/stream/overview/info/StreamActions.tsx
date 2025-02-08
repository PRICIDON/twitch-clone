import React from 'react'
import type { FindChannelByUsernameQuery } from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import FollowButton from '@/components/features/stream/overview/info/FollowButton'
import SupportButton from '@/components/features/stream/overview/info/SupportButton'
import ShareActions from '@/components/features/stream/overview/info/ShareActions'
import { Skeleton } from '@/components/ui/common/skeleton'
import StreamSettings from '@/components/features/stream/settings/StreamSettings'
import { useCurrent } from '@/hooks/useCurrent'

interface StreamActionsProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export default function StreamActions({channel}: StreamActionsProps) {
 	return (
		<div className="space-y-4 space-x-3 lg:mt-0 mr-5 items-center lg:flex lg:space-y-0">
			<FollowButton channel={channel} />
			{channel.isVerified && channel.sponsorshipPlans.length && (
				<SupportButton channel={channel} />
			)}
			<StreamSettings channel={channel} />
			<ShareActions channel={channel}/>
		</div>
	)
}

export function StreamActionsSkeleton() {
	return (
		<div className='mt-6 lg:mt-0'>
			<div className='items-center gap-x-4 space-y-4 lg:flex lg:space-y-0'>
				<Skeleton className='h-10 w-44 rounded-full' />
				<Skeleton className='size-10 rounded-full' />
			</div>
		</div>
	)
}
