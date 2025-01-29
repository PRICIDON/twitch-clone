'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import CardContainer from '@/components/ui/elements/CardContainer'
import ConfirmModal from '@/components/ui/elements/ConfirmModal'
import { Button } from '@/components/ui/common/Button'

export default function DeactivateCard() {
	const t = useTranslations('dashboard.settings.account.deactivation')
	const router = useRouter()
	return (
		<CardContainer heading={t('heading')} description={t('description')} rightContent={
			<div className="flex items-center gap-x-4">
				<ConfirmModal heading={t('confirmModal.heading')} message={t('confirmModal.message')} onConfirm={() => router.push('/account/deactivate')}>
					<Button>{t('button')}</Button>
				</ConfirmModal>
			</div>
		}></CardContainer>
	)
}
