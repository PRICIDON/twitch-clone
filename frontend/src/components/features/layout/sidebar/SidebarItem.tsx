'use client'
import type { LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/hooks/useSidebar'
import Hint from '@/components/ui/elements/Hint'
import { cn } from '@/utils/tw-merge'
import { Button } from '@/components/ui/common/Button'
import Link from 'next/link'

export interface Route {
	label: string
	href: string
	icon: LucideIcon
}

interface SidebarItemProps {
	route: Route
}

export default function SidebarItem({route}: SidebarItemProps) {
	const pathname = usePathname()
	const {isCollapsed} = useSidebar()
	const isActive = pathname === route.href
	return isCollapsed ? (
		// @ts-ignore
		<Hint label={route.label} side="right" asChild>
			<Button variant="ghost" className={cn('h-11 w-full justify-center', isActive && "bg-accent")} asChild>
				<Link className="" href={route.href}>
					<route.icon className="size-5 mr-0" />
				</Link>
			</Button>
		</Hint>
	) : (
		<Button variant="ghost" className={cn('h-11 w-full justify-start', isActive && "bg-accent")} asChild>
				<Link className="flex items-start gap-x-" href={route.href}>
					<route.icon className="size-5 mr-0" />
					{route.label}
				</Link>
		</Button>
	)
}
