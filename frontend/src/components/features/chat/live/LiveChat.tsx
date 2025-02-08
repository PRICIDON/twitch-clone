import React from 'react'
import {
	FindChannelByUsernameQuery,
	useFindMyFollowingsQuery,
	useFindMySponsorsQuery
} from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { Skeleton } from '@/components/ui/common/skeleton'
import { useConnectionState, useRemoteParticipant } from '@livekit/components-react'
import { ConnectionState } from 'livekit-client'
import { useAuth } from '@/hooks/useAuth'
import { MessageSquareOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/common/Card'
import LoadingChat from '@/components/features/chat/live/LoadingChat'
import SendMessageForm from '@/components/features/chat/live/SendMessageForm'
import MessagesList from '@/components/features/chat/live/MessagesList'
import ChatInfo from '@/components/features/chat/live/ChatInfo'
import { useCurrent } from '@/hooks/useCurrent'

interface LiveChatProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
	isChatEnabled: boolean
	isChatFollowersOnly: boolean
	isChatPremiumFollowersOnly: boolean
}

export default function LiveChat({channel, isChatPremiumFollowersOnly, isChatFollowersOnly, isChatEnabled}: LiveChatProps) {
	const t = useTranslations('stream.chat')
	const {isAuthenticated} = useAuth()
	const {user, isLoadingProfile} = useCurrent()
	const connectionState = useConnectionState()
	const participants = useRemoteParticipant(channel.id)
	const isOnline = participants && connectionState === ConnectionState.Connected
	const {data: followingsData, loading: isLoadingFollowings} = useFindMyFollowingsQuery({
		skip: !isAuthenticated
	})
	const followings = followingsData?.findMyFollowings ?? []
	const {data: sponsorsData, loading: isLoadingSponsors} = useFindMySponsorsQuery({
		skip: !isAuthenticated
	})
	const sponsors = sponsorsData?.findMySponsors ?? []
	const isFollower = followings.some(following => following.followingId === channel.id)
	const isSponsor = sponsors.some(sponsor => user?.id === sponsor.user.id)
	const isOwner = user?.id === channel.id

	const isDisabled = !isOnline || !isAuthenticated || (isChatFollowersOnly && !isFollower && !isOwner) || (isChatPremiumFollowersOnly && !isSponsor && !isOwner)
	if(connectionState === ConnectionState.Connecting || isLoadingProfile || isLoadingSponsors || isLoadingFollowings) return <LoadingChat/>
	return (
		<Card className="lg:fixed flex h-[82%] lg:w-[21.5%] overflow-y-auto w-full flex-col xl:mt-0">
			<CardHeader className='border-b py-2'>
				<CardTitle className="text-center text-lg">{t('heading')}</CardTitle>
			</CardHeader>
			<CardContent className="flex h-full flex-col overflow-y-auto p-4">
				{isOnline ? (
					<>
						<MessagesList channel={channel} />
						<ChatInfo
							isOwnerChannel={isOwner}
							isFollower={isFollower}
							isSponsor={isSponsor}
							isChatEnabled={isChatEnabled}
							isChatFollowersOnly={isChatFollowersOnly}
							isChatPremiumFollowersOnly={isChatPremiumFollowersOnly}  />
						<SendMessageForm channel={channel} isDisabled={isDisabled} />
					</>
				) : (
					<div className="flex h-full flex-col items-center justify-center">
						<MessageSquareOff className="size-10 text-muted-foreground"/>
						<h2 className="mt-3 text-xl font-medium">{t('unavailable')}</h2>
						<p className='mt-1 w-full text-center text-muted-foreground'>{t('unavailableMessage')}</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export function LiveChatSkeleton() {
	return (
		<Skeleton className="fixed my-8 flex h-[82%] w-[21.5%] flex-col xl:mt-0"/>
	)
}
