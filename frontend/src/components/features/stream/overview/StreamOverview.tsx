'use client'
import { FindChannelByUsernameQuery } from '@/graphql/generated/output'
import React from 'react'
import { LiveKitRoom } from '@livekit/components-react'
import { LIVEKIT_WS } from '@/libs/constants/url.constants'
import { useStreamToken } from '@/hooks/useStreamToken'
import StreamVideo, { StreamVideoSkeleton } from '@/components/features/stream/overview/player/StreamVideo'
import StreamInfo, { StreamInfoSkeleton } from '@/components/features/stream/overview/info/StreamInfo'
import AboutChannel, { AboutChannelSkeleton } from '@/components/features/stream/overview/info/AboutChannel'
import ChannelSponsors from '@/components/features/stream/overview/info/ChannelSponsors'
import LiveChat, { LiveChatSkeleton } from '@/components/features/chat/live/LiveChat'

interface StreamOverviewProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export default function StreamOverview({ channel }: StreamOverviewProps) {
	const { token, name, identity} = useStreamToken(channel.id)
	if(!token || !name || !identity) return <StreamOverviewSkeleton/>
	return (
		<LiveKitRoom serverUrl={LIVEKIT_WS} token={token} className="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 lg:grid-cols-7">
			<div className="order-1 col-span-1 flex flex-col lg:col-span-5">
				<StreamVideo channel={channel}/>
				<StreamInfo channel={channel}/>
				<AboutChannel channel={channel}/>
				<ChannelSponsors channel={channel}/>
			</div>
			<div className="order-2 col-span-1 flex h-80 flex-col space-y-6 lg:col-span-2">
				<LiveChat
					channel={channel}
					isChatPremiumFollowersOnly={channel.stream.isChatPremiumFollowersOnly}
					isChatEnabled={channel.stream.isChatEnabled}
					isChatFollowersOnly={channel.stream.isChatFollowersOnly}
				/>
			</div>
		</LiveKitRoom>
	)
}

export function StreamOverviewSkeleton() {
	return (
		<div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 lg:grid-cols-7">
			<div className="order-1 col-span-1 flex flex-col lg:col-span-5">
				<StreamVideoSkeleton/>
				<StreamInfoSkeleton/>
				<AboutChannelSkeleton/>
			</div>
			<div className="order-2 col-span-1 flex h-80 flex-col space-y-6 lg:col-span-2">
				<LiveChatSkeleton/>
			</div>
		</div>
	)
}
