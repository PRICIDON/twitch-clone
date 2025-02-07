
import React from 'react'
import { FindRandomStreamsQuery } from '@/graphql/generated/output'
import { Heading } from '@/components/ui/elements/Heading'
import StreamCard from '@/components/features/stream/list/StreamCard'
import EmptyState from '@/components/ui/elements/EmptyState'

interface StreamsListProps {
	heading?: string;
	streams: FindRandomStreamsQuery['findRandomStreams']
}

export default function StreamsList({heading, streams}: StreamsListProps) {
	return streams.length ? (
		<>
			{heading && <Heading title={heading} />}
			<div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{streams.map((stream, i) => (
					<StreamCard key={i} stream={stream} />
				))}
			</div>
		</>
	) : <EmptyState/>
}
