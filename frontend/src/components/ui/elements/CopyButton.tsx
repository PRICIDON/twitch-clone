import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/common/Button'

interface CopyButtonProps {
	value: string | null
}

export default function CopyButton({value}: CopyButtonProps) {
	const t = useTranslations('components.copyButton')
	const [isCopied, setIsCopied] = useState(false)
	function onCopy() {
		if(!value) return
		setIsCopied(true)
		navigator.clipboard.writeText(value)
		toast.success(t('successMessage'))
		setTimeout(() => setIsCopied(false), 2000)
	}
	const Icon = isCopied ? Check : Copy
	return <Button variant="ghost" size="icon" onClick={() => onCopy()} disabled={!value || isCopied}>
		<Icon className="size-5"/>
	</Button>
}
