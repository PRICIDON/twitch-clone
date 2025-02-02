'use client'
import { type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import CardContainer from '@/components/ui/elements/CardContainer'
import { BASE_COLORS } from '@/libs/constants/colors.constants'
import { useConfig } from '@/hooks/useConfig'
import { Check } from 'lucide-react'

export default function ChangeColorForm() {
	const t = useTranslations('dashboard.settings.appearance.color')

	const config = useConfig()


	return (
		<CardContainer
			heading={t('heading')}
			description={t('description')}
			rightContent={
			<div className="grid grid-cols-4 gap-2 md:grid-cols-8 ">
				{BASE_COLORS.map((theme, i) => {
					const isActive = theme.name == config.theme
					return (
						<button style={{
							'--theme-primary': `hsl(${theme.color})`
						} as CSSProperties} key={i} onClick={() => config.setTheme(theme.name)}>
							<span className="flex size-9 shrink-0 -translate-x-1 items-center justify-center rounded-lg bg-[--theme-primary] hover:border-2 hover:border-foreground">
								{isActive && <Check className="size-5 text-white"/>}
							</span>
						</button>
					)
				})}
			</div>
			}/>
	)
}
