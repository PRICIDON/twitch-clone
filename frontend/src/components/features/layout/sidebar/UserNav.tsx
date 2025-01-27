import { useTranslations } from 'next-intl'
import SidebarItem, { Route } from '@/components/features/layout/sidebar/SidebarItem'
import { Folder, Home, Radio } from 'lucide-react'
import React from 'react'
import RecommendedChannels from '@/components/features/layout/sidebar/RecommendedChannels'

export default function UserNav() {
	const t = useTranslations('layout.sidebar.userNav')
	const routes: Route[] = [
		{
			label: t('home'),
			href: '/',
			icon: Home,
		},
		{
			label: t('categories'),
			href: '/categories',
			icon: Folder,
		},
		{
			label: t('streams'),
			href: '/streams',
			icon: Radio,
		}
	]
	return (
		<div className="space-y-2 px-2 pt-4 lg:pt-8">
			{routes.map((route, i) => (
				<SidebarItem key={i} route={route}/>
			))}
			<RecommendedChannels />
		</div>
	)
}
