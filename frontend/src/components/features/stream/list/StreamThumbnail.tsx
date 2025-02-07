'use client'
import React, { useEffect, useState } from 'react'
import { type FindProfileQuery } from '@/graphql/generated/output'
import { getRandomColor } from '@/utils/color'
import { getMediaSource } from '@/utils/get-media-source'
import Image from 'next/image'
import { Card } from '@/components/ui/common/Card'
import { ChannelAvatar } from '@/components/ui/elements/ChannelAvatar'
import LiveBadge from '@/components/ui/elements/LiveBadge'

interface StreamThumbnailProps {
	url: string | null | undefined
	user: Pick<FindProfileQuery['findProfile'], 'username' | 'avatar' | 'isVerified'>
	isLive?: boolean
}

export default function StreamThumbnail({url, user, isLive}: StreamThumbnailProps) {
	const [randomColor, setRandomColor] = useState('')
	useEffect(() => {
		setRandomColor(getRandomColor())
	}, [])
	return (
		<div className="group relative aspect-video cursor-pointer rounded-xl">
			<div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100" style={{
				backgroundColor: randomColor,
			}}/>
			{url ? (
				<Image src={getMediaSource(url)} alt={user.username} fill className="rounded-xl object-cover transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2" />
			): (
				<Card className="flex flex-col h-full w-full items-center justify-center rounded-xl gap-y-4 transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2">
					<ChannelAvatar channel={user} isLive={isLive}/>
				</Card>
			)}
			{isLive && (
				<div className="absolute right-2 top-2 transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2">
					<LiveBadge/>
				</div>
			)}
		</div>
	)
}
