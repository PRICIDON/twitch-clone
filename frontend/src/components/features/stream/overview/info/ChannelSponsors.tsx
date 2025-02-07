import React from 'react'
import { FindChannelByUsernameQuery, useFindSponsorsByChannelQuery } from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { Card, CardHeader, CardTitle, CardContent} from '@/components/ui/common/Card'
import Link from 'next/link'
import { ChannelAvatar } from '@/components/ui/elements/ChannelAvatar'

interface ChannelSponsorsProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export default function ChannelSponsors({channel}: ChannelSponsorsProps) {
	const t = useTranslations('stream.sponsors')
	const {data, loading: isLoadingSponsors} = useFindSponsorsByChannelQuery({
		variables: {
			channelId: channel.id,
		}
	})
	const sponsors = data?.findSponsorsByChannel ?? []

	if(!sponsors.length || isLoadingSponsors) return null

	return (
		<Card className='mt-6'>
			<CardHeader className="p-4">
				<CardTitle className="text-xl">
					{t('heading')} {channel.displayName}
				</CardTitle>
			</CardHeader>
			<CardContent className='grid grid-cols-12 px-4'>
				{sponsors.map((sponsor,index) => (
					<Link key={index} href={`/${sponsor.user.username}`}>
						<ChannelAvatar channel={sponsor.user} size='lg' />
					</Link>
				))}
			</CardContent>
		</Card>
	)
}
