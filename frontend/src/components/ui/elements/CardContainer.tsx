import React, { PropsWithChildren, ReactNode } from 'react'
import { Card } from '@/components/ui/common/Card'

interface CardContainerProps {
	heading: string,
	description: string,
	rightContent?: ReactNode
}

export default function CardContainer({children, rightContent, description, heading}: PropsWithChildren<CardContainerProps>) {
	return (
		<Card className="p-6">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="font-semibold tracking-wide">{heading}</h2>
					<p className="max-w-4xl text-sm text-muted-foreground">{description}</p>
				</div>
				{rightContent && <div>{rightContent}</div>}
			</div>
			{children && <div className="mt-4">{children}</div>}
		</Card>
	)
}
