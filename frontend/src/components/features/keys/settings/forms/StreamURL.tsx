import React from 'react'
import { useTranslations } from 'next-intl'
import CardContainer from '@/components/ui/elements/CardContainer'
import { Input } from '@/components/ui/common/input'
import CopyButton from '@/components/ui/elements/CopyButton'

interface StreamURLProps {
	value: string | null
}

export default function StreamUrl({value}: StreamURLProps) {
	const t = useTranslations('dashboard.keys.url')
	return <CardContainer heading={t('heading')}>
		<div className="flex w-full items-center gap-x-4">
			<Input placeholder={t('heading')} value={value ?? ''} disabled/>
			<CopyButton value={value} />
		</div>
	</CardContainer>
}
