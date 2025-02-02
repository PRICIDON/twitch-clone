import React from 'react'
import { FindRandomStreamsQuery } from '@/graphql/generated/output'
import Link from 'next/link'

interface StreamCardProps {
	stream: FindRandomStreamsQuery['findRandomStreams'][0]
}

export default function StreamCard({stream}: StreamCardProps) {
	return (
		<div className="h-full w-full">
			<Link href={`/${stream.user.username}`}></Link>
		</div>
	)
}
