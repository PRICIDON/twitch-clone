import React, { PropsWithChildren } from 'react'
import type { FindSessionsByUserQuery } from '@/graphql/generated/output'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/common/dialog'
import { useTranslations } from 'next-intl'
import { formatDate } from '@/utils/format-date'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'

interface SessionModalProps {
	session: FindSessionsByUserQuery['findSessionsByUser'][0]
}

export default function SessionModal({session, children}: PropsWithChildren<SessionModalProps>) {
	const t = useTranslations('dashboard.settings.sessions.sessionModal')
	const center = [
		session.metadata.location.latidute,
		session.metadata.location.longitude,
	]
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogTitle className="text-xl">{t('heading')}</DialogTitle>
				<div className="space-y-3">
					<div className="flex items-center">
						<span className="font-medium">{t('device')}</span>
						<span className="ml-2 text-muted-foreground">
							{session.metadata.device.browser}, {session.metadata.device.os}
						</span>
					</div>
					<div className="flex items-center">
						<span className="font-medium">{t('location')}</span>
						<span className="ml-2 text-muted-foreground">
							{session.metadata.location.country}, {session.metadata.location.city}
						</span>
					</div>
					<div className="flex items-center">
						<span className="font-medium">{t('ipAddress')}</span>
						<span className="ml-2 text-muted-foreground">
							{session.metadata.ip}
						</span>
					</div>
					<div className="flex items-center">
						<span className="font-medium">{t('createdAt')}</span>
						<span className="ml-2 text-muted-foreground">
							{formatDate(session.createdAt, true)}
						</span>
					</div>
					<YMaps>
						<div style={{width: '100%', height: '300px'}}>
							<Map defaultState={{ center, zoom: 11 }} width="100%" height="100%">
								<Placemark></Placemark>
							</Map>
						</div>
					</YMaps>
				</div>
			</DialogContent>
		</Dialog>
	)
}
