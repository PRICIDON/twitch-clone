import React, { PropsWithChildren, ReactNode } from 'react'
import { Card } from '@/components/ui/common/Card'
import { type LucideIcon } from 'lucide-react'
import { type IconType } from 'react-icons'

interface CardContainerProps {
	heading: string,
	description?: string,
	rightContent?: ReactNode
	Icon?: IconType | LucideIcon
}

export default function CardContainer({children, rightContent, description, heading, Icon}: PropsWithChildren<CardContainerProps>) {
	return (
		<Card className="p-6">
			<div className="flex items-center justify-between">
				<div className='flex flex-row items-center gap-x-4'>
					{Icon && (
					<div className="rounded-full bg-foreground p-2.5">
						<Icon className="size-7 text-secondary" />
					</div>
				)}
				<div className="space-y-1">
					<h2 className="font-semibold tracking-wide">{heading}</h2>
					{description && (<p className="max-w-4xl text-sm text-muted-foreground">{description}</p>)}

				</div>
				</div>
				{rightContent && <div>{rightContent}</div>}
			</div>
			{children && <div className="mt-4">{children}</div>}
		</Card>
	)
}
