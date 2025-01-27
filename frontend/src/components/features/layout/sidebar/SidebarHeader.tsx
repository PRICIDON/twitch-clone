import React from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/hooks/useSidebar'
import Hint from '@/components/ui/elements/Hint'
import { Button } from '@/components/ui/common/Button'
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react'

export default function SidebarHeader() {
	const t = useTranslations('layout.sidebar.header')
	const pathname = usePathname()
	const {isCollapsed, close, open} = useSidebar()
	const label = isCollapsed ? t('expand') : t('collapse')
	return isCollapsed ? (
		<div className="mb-4 hidden w-full items-center justify-center pt-4 lg:flex">
			{/*@ts-ignore*/}
			<Hint label={label} side="right" asChild>
				<Button size="icon" variant="ghost" onClick={() => close()}>
					<ArrowRightFromLine className="size-4" />
				</Button>
			</Hint>
		</div>
	) : (
		<div className="mb-2 flex w-full items-center justify-between p-3 pl-4">
			<h2 className="text-lg font-semibold text-foreground">{t('navigation')}</h2>
			{/*@ts-ignore*/}
			<Hint label={label} side="right" asChild>
				<Button size="icon" variant="ghost" onClick={() => open()}>
					<ArrowLeftFromLine className="size-4" />
				</Button>
			</Hint>
		</div>
	)
}
