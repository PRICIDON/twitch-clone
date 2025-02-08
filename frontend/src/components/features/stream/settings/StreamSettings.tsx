import React from 'react'
import type { FindChannelByUsernameQuery } from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/common/dialog'
import { Button } from '@/components/ui/common/Button'
import { Pencil } from 'lucide-react'
import { ChangeThumbnailForm } from '@/components/features/stream/settings/ChangeThumbnailForm'
import { ChangeInfoForm } from '@/components/features/stream/settings/ChangeInfoForm'

interface StreamSettingsProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export default function StreamSettings({ channel }: StreamSettingsProps) {
	const t = useTranslations('stream.settings')
	const { user } = useCurrent()
	const isOwner = user?.id === channel.id
	if (!isOwner) return null
	return (
		<Dialog>
			<DialogTrigger className="" asChild>
				<Button variant='ghost' size='lgIcon'>
					<Pencil className="size-5"/>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('heading')}</DialogTitle>
				</DialogHeader>
				<ChangeThumbnailForm stream={channel.stream} />
				<ChangeInfoForm stream={channel.stream} />
			</DialogContent>
		</Dialog>
	)
}
