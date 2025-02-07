'use client'
import React, { useEffect, useState } from 'react'
import { type FindAllStreamsQuery, useFindAllStreamsQuery } from '@/graphql/generated/output'
import StreamsList from '@/components/features/stream/list/StreamsList'
import InfinityScroll from 'react-infinite-scroll-component'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Heading } from '@/components/ui/elements/Heading'
import { StreamCardSkeleton } from '@/components/features/stream/list/StreamCard'

interface StreamContentProps {
	streams: FindAllStreamsQuery['findAllStreams']
}

export default function StreamContent({streams}: StreamContentProps) {
	const t = useTranslations('streams')
	const searchParams = useSearchParams()
	const searchTerm = searchParams.get('searchTerm')

	const [streamList, setStreamList] = useState<FindAllStreamsQuery['findAllStreams']>(streams ?? [])
	const [hasMore, setHasMore] = useState(true)

	const {data, fetchMore} = useFindAllStreamsQuery({
		variables: {
			filters: {
				searchTerm,
				take: 12,
				skip: 0
			}
		},
		fetchPolicy: 'network-only',
	})

	useEffect(() => {
		if(data?.findAllStreams) {
			setStreamList(data.findAllStreams)
			setHasMore(data.findAllStreams.length === 12)
		}
	}, [data, searchTerm])

	function fetchMoreStreams() {
		if(!hasMore) return
		setTimeout(async () => {
			const { data: newData } = await fetchMore({
				variables: {
					filters: {
						searchTerm,
						take: 12,
						skip: streamList.length,
					}
				}
			})
			if (newData?.findAllStreams.length) {
				setStreamList(prev => [...prev, ...newData.findAllStreams])
			} else {
				setHasMore(false)
			}
		}, 400)
	}

	return (
		<>
			<Heading title={searchTerm ? `${t('searchHeading')} "${searchTerm}"` : t('heading')}/>
			<InfinityScroll dataLength={streamList.length} next={fetchMoreStreams} hasMore={hasMore} loader={
				<div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{Array.from({ length: 12 }).map((_, i) => (
						<StreamCardSkeleton key={i}/>
					))}
				</div>
			}>
				<StreamsList streams={streamList}></StreamsList>
			</InfinityScroll>
		</>
	)
}

