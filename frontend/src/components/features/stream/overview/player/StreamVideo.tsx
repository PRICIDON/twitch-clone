import React, { JSX } from 'react'
import { FindChannelByUsernameQuery } from '@/graphql/generated/output'
import { useConnectionState, useRemoteParticipant, useTracks } from '@livekit/components-react'
import { ConnectionState, Track } from 'livekit-client'
import OfflineStream from '@/components/features/stream/overview/player/OfflineStream'
import LoadingStream from '@/components/features/stream/overview/player/LoadingStream'
import StreamPlayer from '@/components/features/stream/overview/player/StreamPlayer'
import { Skeleton } from '@/components/ui/common/skeleton'

interface StreamVideoProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export default function StreamVideo({ channel }: StreamVideoProps) {
	const connectionState = useConnectionState()
	const participant = useRemoteParticipant(channel.id)

	const tracks = useTracks([
		Track.Source.Camera,
		Track.Source.Microphone
	]).filter(track => track.participant.identity === channel.id)
	let content: JSX.Element

	if(!participant && connectionState === ConnectionState.Connected) {
		content = <OfflineStream channel={channel} />
	} else if(!participant || tracks.length === 0) {
		content = <LoadingStream />
	} else {
		content = <StreamPlayer participant={participant} />
	}

	return (
		<div className='group relative mb-6 aspect-video rounded-lg'>{content}</div>
	)
}


export function StreamVideoSkeleton() {
	return (
		<div className="mb-6 aspect-video">
			<Skeleton className="h-full w-full rounded-lg"/>
		</div>
	)
}
