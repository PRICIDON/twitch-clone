import React from 'react'
import type { FindChannelByUsernameQuery } from '@/graphql/generated/output'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/common/Card'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getSocialIcon } from '@/utils/get-social-icon'
import { Skeleton } from '@/components/ui/common/skeleton'

interface AboutChannelProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export default function AboutChannel({channel}: AboutChannelProps) {
	const t = useTranslations('stream.aboutChannel')
	return (
		<Card className="mt-6">
			<CardHeader className="p-4">
				<CardTitle className="text-xl">{t('heading')} {channel.displayName}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 px-4 -mt-1">
				<div className="text-[15px] text-foreground">
					<span className="font-semibold">{channel.followings.length} </span>
					{t('followersCount')}
				</div>
				<div className="text-[15px] text-muted-foreground">
					{channel.bio ?? t('noDescription')}
				</div>
				{channel.socialLinks.length && <div className="grid gap-x-3 md:grid-cols-3 xl:grid-cols-8">
					{channel.socialLinks.map((link, i) => {
						const Icon = getSocialIcon(link.url)
						return (
							<Link key={i} href={link.url} className='flex items-center pr-1 text-[15px] hover:text-primary' target="_blank">
								<Icon className="size-4 mr-2"/>
								{link.title}
							</Link>
						)
					})}
				</div>}
			</CardContent>
		</Card>
	)
}

export function AboutChannelSkeleton() {
	return (
		<Skeleton className="mt-6 h-36 w-full"></Skeleton>
	)
}
