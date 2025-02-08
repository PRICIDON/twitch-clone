'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ToggleCard, { ToggleCardSkeleton } from '@/components/ui/elements/ToggleCard'
import { Form, FormField } from '@/components/ui/common/Form'
import { useChangeChatSettingsMutation } from '@/graphql/generated/output'
import { toast } from 'sonner'
import { changeChatSettingsSchema, TypeChangeChatSettingsSchema } from '@/schemas/chat/change-chat-settings.schema'
import { Heading } from '@/components/ui/elements/Heading'

export default function ChangeChatSettings() {
	const t = useTranslations('dashboard.chat')
	const {  user, isLoadingProfile } = useCurrent()

	const  form = useForm<TypeChangeChatSettingsSchema>({
		resolver: zodResolver(changeChatSettingsSchema),
		values: {
			isChatEnabled: user?.stream.isChatEnabled ?? true,
			isChatFollowersOnly: user?.stream.isChatFollowersOnly ?? false,
			isChatPremiumFollowersOnly: user?.stream.isChatPremiumFollowersOnly ?? false
		}
	})

	const [update, { loading: isLoadingUpdate}] = useChangeChatSettingsMutation({
		onCompleted() {
			toast.success(t('successMessage'))
		},
		onError() {
			toast.error(t('errorMessage'))
		}
	})

	function onChange(field: keyof TypeChangeChatSettingsSchema, value: boolean) {
		form.setValue(field, value)
		update({
			variables: {
				data: {...form.getValues(), [field]: value}
			}
		})
	}
	return <div className="lg:px-10">
		<Heading title={t('header.heading')} description={t('header.description')} size="lg" />
		<div className="mt-3 space-y-6">
			{isLoadingProfile ? Array.from({length:3}).map((_, i) => (
					<ToggleCardSkeleton key={i}/>
				)) : (
				<Form {...form}>
					<FormField control={form.control} name="isChatEnabled" render={({field}) => (
						<ToggleCard
							heading={t('isChatEnabled.heading')}
							description={t('isChatEnabled.description')}
							value={field.value}
							onChange={value => onChange('isChatEnabled', value)}
							isDisabled={isLoadingUpdate}
						/>
					)}/>
					<FormField control={form.control} name="isChatFollowersOnly" render={({field}) => (
						<ToggleCard
							heading={t('isChatFollowersOnly.heading')}
							description={t('isChatFollowersOnly.description')}
							value={field.value}
							onChange={value => onChange('isChatFollowersOnly', value)}
							isDisabled={isLoadingUpdate}
						/>
					)}/>
					<FormField control={form.control} name="isChatPremiumFollowersOnly" render={({field}) => (
						<ToggleCard
							heading={t('isChatPremiumFollowersOnly.heading')}
							description={t('isChatPremiumFollowersOnly.description')}
							value={field.value}
							onChange={value => onChange('isChatPremiumFollowersOnly', value)}
							isDisabled={isLoadingUpdate || !user?.isVerified}
						/>
					)}/>
				</Form>)}
		</div>
	</div>
}
