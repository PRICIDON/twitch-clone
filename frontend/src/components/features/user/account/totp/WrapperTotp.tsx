'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { Skeleton } from '@/components/ui/common/skeleton'
import CardContainer from '@/components/ui/elements/CardContainer'
import EnableTotp from '@/components/features/user/account/totp/EnableTotp'
import DisableTotp from '@/components/features/user/account/totp/DisableTotp'

export default function WrapperTotp() {
	const t = useTranslations('dashboard.settings.account.twoFactor')
	const { user, isLoadingProfile } = useCurrent()
	return isLoadingProfile ? <WrapperTotpSkeleton/> :(
		<CardContainer heading={t('heading')} description={t('description')} rightContent={
			<div className="gap-x-4 flex items-center">
				{!user?.isTotpEnabled ? <EnableTotp/> : <DisableTotp/>}
			</div>
		} ></CardContainer>
	)
}

export function WrapperTotpSkeleton() {
	return (
		<Skeleton className="w-full h-24"/>
	)
}
