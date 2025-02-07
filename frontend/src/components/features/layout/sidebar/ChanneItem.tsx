'use client'
import React from 'react'
import { FindRecommendedChannelsQuery } from '@/graphql/generated/output'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/hooks/useSidebar'
import Link from 'next/link'
import Hint from '@/components/ui/elements/Hint'
import { Button } from '@/components/ui/common/Button'
import { ChannelAvatar } from '@/components/ui/elements/ChannelAvatar'
import { cn } from '@/utils/tw-merge'
import { ChannelVerified } from '@/components/ui/elements/ChannelVerified'
import LiveBadge from '@/components/ui/elements/LiveBadge'
import { Skeleton } from '@/components/ui/common/skeleton'

interface ChannelItemProps {
	channel:FindRecommendedChannelsQuery['findRecommendedChannels'][0],
}

export default function ChannelItem({channel}: ChannelItemProps) {
	const pathname = usePathname()
	const {isCollapsed} = useSidebar()
	const isActive = pathname === `/${channel.username}`
	return isCollapsed ? (
		<Hint label={channel.username} side="right" asChild>
				<Link className="mt-3 flex w-full items-center justify-center" href={`/${channel.username}`}>
					<ChannelAvatar channel={channel} isLive={channel.stream.isLive}/>
				</Link>
		</Hint>
	) : (
		<Button variant="ghost" className={cn('h-11 w-full justify-start', isActive && "bg-accent")} asChild>
				<Link className="flex w-full items-center" href={`/${channel.username}`}>
					<ChannelAvatar channel={channel} isLive={channel.stream.isLive} size="sm"/>
					<h2 className="truncate pl-2">{channel.username}</h2>
					{channel.isVerified && (
						<ChannelVerified size="sm"/>
					)}
					{channel.stream.isLive && (
						<div className="absolute right-5 ">
							<LiveBadge	/>
						</div>
					)}
				</Link>
		</Button>
	)
}

export function ChannelItemSkeleton() {
	return (
		<Skeleton className="mt-3 h-11 w-full rounded-full"/>
	)
}
