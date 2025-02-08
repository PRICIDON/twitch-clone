import React from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/useAuth'
import { Info } from 'lucide-react'

interface ChatInfoProps {
	isOwnerChannel: boolean
	isFollower: boolean
	isSponsor: boolean
	isChatEnabled: boolean
	isChatFollowersOnly: boolean
	isChatPremiumFollowersOnly: boolean
}

export default function ChatInfo({isChatFollowersOnly, isFollower, isChatPremiumFollowersOnly, isChatEnabled, isOwnerChannel, isSponsor}: ChatInfoProps) {
	const t = useTranslations('stream.chat.info')
	const { isAuthenticated } = useAuth()
	let message = ''
	if(!isAuthenticated) {
		message = t('authRequired')
	} else if(isOwnerChannel) return null
	else if(!isChatEnabled) {
		message = t('chatDisabled')
	} else if(isChatPremiumFollowersOnly && !isSponsor) {
		message = t('premiumFollowersOnly')
	} else if(isChatFollowersOnly && !isFollower) {
		message = t('followersOnly')
	} else return null

	return (
		<div className="mt-2 flex h-10 w-full items-center gap-x-2 rounded-md border bg-accent px-3 text-muted-foreground">
			<Info className='size-4'/>
			<p className="text-sm font-semibold">{message}</p>
		</div>
	)
}
