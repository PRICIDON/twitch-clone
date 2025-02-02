import React from 'react'
import { type FindProfileQuery } from '@/graphql/generated/output'

interface StreamThumbnailProps {
	url: string | null | undefined
	user: Pick<FindProfileQuery['findProfile'], 'username' | 'avatar' | 'isVerified'>
	isLive?: boolean
}

export default function StreamThumbnail({url, user, isLive}: StreamThumbnailProps) {
	return (
		<div className="relative aspect-video cursor-pointer rounded-lg"></div>
	)
}
