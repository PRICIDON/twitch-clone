'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useFindCurrentSessionQuery, useFindSessionsByUserQuery } from '@/graphql/generated/output'
import { Heading } from '@/components/ui/elements/Heading'
import { ToggleCardSkeleton } from '@/components/ui/elements/ToggleCard'
import SessionItem from '@/components/features/user/sessions/SessionItem'

export default function SessionsList() {
	const t = useTranslations('dashboard.settings.sessions')
	const {data: sessionData, loading: isLoadingCurrent} = useFindCurrentSessionQuery()
	const currentSession = sessionData?.findCurrentSession!
	const {data: sessionsData, loading: isLoadingSessions} = useFindSessionsByUserQuery()
	const sessions = sessionsData?.findSessionsByUser ?? []
	return (
		<div className='space-y-6'>
			<Heading size="sm" title={t('info.current')}/>
			{isLoadingCurrent ? (
				<ToggleCardSkeleton/>
			) : (
				<SessionItem session={currentSession} isCurrentSession />
			)}
			<Heading size="sm" title={t('info.active')}/>
			{isLoadingSessions ? (
				Array.from({length: 3}).map((_, i) => (
					<ToggleCardSkeleton key={i}/>
				))
			) : sessions.length ? (
					sessions.map((session, i) => (
						<SessionItem session={session} key={i} />
					))
			) : (
				<div className="text-muted-foreground">{t('info.notFound')}</div>
			)
			}
		</div>
	)
}
