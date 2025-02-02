import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import CardContainer from '@/components/ui/elements/CardContainer'
import { Input } from '@/components/ui/common/input'
import CopyButton from '@/components/ui/elements/CopyButton'
import { Button } from '@/components/ui/common/Button'
import { Eye,EyeOff } from 'lucide-react'

interface StreamKeyProps {
	value: string | null
}

export default function StreamKey({value}: StreamKeyProps) {
	const [isShow, setIsShow] = useState(false)
	const t = useTranslations('dashboard.keys.key')
	const Icon = isShow ? Eye : EyeOff
	return <CardContainer heading={t('heading')}>
		<div className="flex w-full items-center gap-x-4">
			<Input placeholder={t('heading')} value={value ?? ''} disabled type={isShow ? 'text' : 'password'} />
			<CopyButton value={value} />
			<Button variant='ghost' size='icon' onClick={() => setIsShow(!isShow)}>
				<Icon className="size-5" />
			</Button>
		</div>
	</CardContainer>
}
