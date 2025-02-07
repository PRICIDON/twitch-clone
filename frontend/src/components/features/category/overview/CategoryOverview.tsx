'use client'

import React from 'react'
import { FindCategoryBySlugQuery } from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { getMediaSource } from '@/utils/get-media-source'
import Image from 'next/image'
import { Heading } from '@/components/ui/elements/Heading'
import StreamsList from '@/components/features/stream/list/StreamsList'

interface CategoryOverviewProps {
	category: FindCategoryBySlugQuery['findCategoryBySlug']
}

export default function CategoryOverview({category}: CategoryOverviewProps) {
	const t = useTranslations('categories.overview')
	return (
		<div className="space-y-8">
			<div className="lg:items-center gap-x-6 lg:flex lg:space-y-6">
				<Image src={getMediaSource(category.thumbnailUrl)} alt={category.title} width={192} height={256} className="rounded-xl object-cover" />
				<Heading title={category.title} description={category.description ?? ''} size="xl"/>
			</div>
			<StreamsList streams={category.streams} heading={t('heading')} />
		</div>
	)
}
