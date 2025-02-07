import React from 'react'
import { Card } from '@/components/ui/common/Card'
import { Loader } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function LoadingChat() {
	const t = useTranslations('stream.chat')
	return (
		<Card className="fixed my-8 flex h-[82%] w-[21.5%] flex-col xl:mt-0 items-center justify-center">
			<Loader className="size-10 animate-spin text-muted-foreground"/>
			<p className="mt-3 text-lg text-muted-foreground">
				{t('loading')}
			</p>
		</Card>
	)
}
