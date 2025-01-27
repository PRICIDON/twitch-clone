import { useTranslations } from 'next-intl'
import SidebarItem, { Route } from '@/components/features/layout/sidebar/SidebarItem'
import { Banknote, DollarSign, KeyRound, Medal, MessageSquare, Settings, Users } from 'lucide-react'
import React from 'react'

export default function DashboardNav() {
	const t = useTranslations('layout.sidebar.dashboardNav')
	const routes: Route[] = [
		{
			label: t('settings'),
			href: '/dashboard/settings',
			icon: Settings,
		},
		{
			label: t('chatSettings'),
			href: '/dashboard/chat',
			icon: MessageSquare,
		},
		{
			label: t('keys'),
			href: '/dashboard/keys',
			icon: KeyRound,
		},
		{
			label: t('followers'),
			href: '/dashboard/followers',
			icon: Users,
		},
		{
			label: t('sponsors'),
			href: '/dashboard/sponsors',
			icon: Medal,
		},
		{
			label: t('premium'),
			href: '/dashboard/plans',
			icon: DollarSign,
		},
		{
			label: t('transactions'),
			href: '/dashboard/transactions',
			icon: Banknote,
		},
	]
	return (
		<div className="space-y-2 px-2 pt-4 lg:pt-8">
			{routes.map((route, i) => (
				<SidebarItem key={i} route={route}/>
			))}
		</div>
	)
}
