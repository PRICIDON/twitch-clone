import { useTranslations } from 'next-intl'
import { Maximize, Minimize } from 'lucide-react'
import Hint from '@/components/ui/elements/Hint'
import { Button } from '@/components/ui/common/Button'
import React from 'react'

interface FullscreenControlProps {
	isFullscreen: boolean;
	onToggle: () => void;
}
export default function FullscreenControl({isFullscreen, onToggle}: FullscreenControlProps) {
	const t = useTranslations('stream.video.player.fullscreen')
	const Icon = isFullscreen ? Minimize : Maximize
	return (
		<div className="flex items-center justify-center gap-4">
			<Hint asChild label={isFullscreen ? t('exit') : t('open')}>
				<Button variant="ghost" size="icon" onClick={onToggle} className="text-white hover:bg-white/10">
					<Icon className="size-8"/>
				</Button>
			</Hint>
		</div>
	)
}
