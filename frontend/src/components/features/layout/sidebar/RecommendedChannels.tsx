'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useFindRecommendedChannelsQuery } from '@/graphql/generated/output'
import { useSidebar } from '@/hooks/useSidebar'
import { Separator } from '@/components/ui/common/separator'
import ChannelItem, { ChannelItemSkeleton } from '@/components/features/layout/sidebar/ChanneItem'
import { Skeleton } from '@/components/ui/common/skeleton'

export default function RecommendedChannels() {
	const t = useTranslations('layout.sidebar.recommended')
	const {data, loading: isLoadingRecommended} = useFindRecommendedChannelsQuery()
	const channels = data?.findRecommendedChannel ?? []
	const {isCollapsed} = useSidebar()
	return (
		<div>
			<Separator className="mb-3"/>
			{!isCollapsed && (
				<h2 className="text-lg mb-2 px-2 font-semibold text-foreground">
					{t('heading')}
				</h2>
			)}
			{isLoadingRecommended ? Array.from({length:7}).map((_, i) => (
				<ChannelItemSkeleton key={i}/>
			)) : channels.map((channel,i) => (
				<ChannelItem key={i} channel={channel} />
			))}
		</div>
	)
}
