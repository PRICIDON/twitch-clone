import React, { PropsWithChildren } from 'react'
import CardContainer from '@/components/ui/elements/CardContainer'
import { Switch } from '@/components/ui/common/switch'
import { Skeleton } from '@/components/ui/common/skeleton'

interface ToggleCardProps {
	heading: string
	description: string
	isDisabled?: boolean
	value: boolean
	onChange: (value: boolean) => void
}

export default function ToggleCard({ description, heading, onChange, value, isDisabled}:PropsWithChildren<ToggleCardProps>) {
	return <CardContainer description={description} heading={heading} rightContent={<Switch checked={value} onCheckedChange={onChange} disabled={isDisabled}/>}/>
}

export function ToggleCardSkeleton() {
	return (
		<Skeleton className="mt-6 h-20 w-full" />
	)
}
