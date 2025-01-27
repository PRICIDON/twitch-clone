'use client'
import React from 'react'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/utils/tw-merge'
import SidebarHeader from '@/components/features/layout/sidebar/SidebarHeader'
import { usePathname } from 'next/navigation'
import DashboardNav from '@/components/features/layout/sidebar/DashboardNav'
import UserNav from '@/components/features/layout/sidebar/UserNav'

export default function Sidebar() {
	const {isCollapsed}=useSidebar()
	const pathname = usePathname()
	const isDashboardPage = pathname.includes('/dashboard')
	return (
		<aside className={cn('fixed left-0 z-50 mt-[75px] flex h-full flex-col border-r border-border bg-card transition-all duration-100 ease-in-out', isCollapsed ? 'w-16':'w-64')}>
			<SidebarHeader />
			{isDashboardPage ? <DashboardNav/> : <UserNav/>}
		</aside>
	)
}
