'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { Heading } from '@/components/ui/elements/Heading'
import { InstructionModal } from '@/components/features/keys/settings/InstructionModal'
import CreateIngressForm from '@/components/features/keys/settings/forms/CreateIngressForm'
import { ToggleCardSkeleton } from '@/components/ui/elements/ToggleCard'
import StreamUrl from '@/components/features/keys/settings/forms/StreamURL'
import StreamKey from '@/components/features/keys/settings/forms/StreamKey'

export default function KeysSettings() {
	const t = useTranslations('dashboard.keys.header')
	const {user, isLoadingProfile} = useCurrent()
	return (
		<div className="lg:px-10">
			<div className="block items-center justify-between space-y-3 lg:flex lg:space-y-0">
				<Heading title={t('heading')} description={t('description')} size={'lg'}/>
				<div className="flex items-center gap-x-4">
					<InstructionModal />
					<CreateIngressForm />
				</div>
			</div>
			<div className="mt-5 space-y-6">
					{isLoadingProfile ? Array.from({length:2}).map((_,i) => (
						<ToggleCardSkeleton />
					)) : (
						<>
							<StreamUrl value={user?.stream.serverUrl!}/>
							<StreamKey value={user?.stream.streamKey!}/>
						</>
					)}
			</div>
		</div>
	)
}
