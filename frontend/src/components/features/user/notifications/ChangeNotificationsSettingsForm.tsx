'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { useForm } from 'react-hook-form'
import {
	changeNotificationsSettingsSchema,
	type TypeChangeNotificationsSettingsSchema
} from '@/schemas/user/change-notification-settings'
import { zodResolver } from '@hookform/resolvers/zod'
import ToggleCard, { ToggleCardSkeleton } from '@/components/ui/elements/ToggleCard'
import { Form, FormField } from '@/components/ui/common/Form'
import { useChangeNotificationsSettingsMutation } from '@/graphql/generated/output'
import { toast } from 'sonner'

export default function ChangeNotificationsSettingsForm() {
	const t = useTranslations('dashboard.settings.notifications')
	const { user, isLoadingProfile, refetch } = useCurrent()

	const  form = useForm<TypeChangeNotificationsSettingsSchema>({
		resolver: zodResolver(changeNotificationsSettingsSchema),
		values: {
			siteNotifications: user?.notificationSettings.siteNotifications ?? false,
			telegramNotifications: user?.notificationSettings.telegramNotifications ?? false,
		}
	})

	const [update, { loading: isLoadingUpdate}] = useChangeNotificationsSettingsMutation({
		onCompleted(data) {
			refetch()
			toast.success(t('successMessage'))
			if(data.changeNotificationsSettings.telegramAuthToken) {
				window.open(`https://t.me/PricidonStream_bot?start=${data.changeNotificationsSettings.telegramAuthToken}`, '_blank')
			}
		},
		onError() {
			toast.error(t('errorMessage'))
		}
	})

	function onChange(field: keyof TypeChangeNotificationsSettingsSchema, value: boolean) {
		form.setValue(field, value)
		update({
			variables: {
				data: {...form.getValues(), [field]: value}
			}
		})
	}
	return isLoadingProfile ? Array.from({length:2}).map((_, i) => (
				<ToggleCardSkeleton key={i}/>
			)) : (
				<Form {...form}>
					<FormField control={form.control} name="siteNotifications" render={({field}) => (
						<ToggleCard
							heading={t('siteNotifications.heading')}
							description={t('siteNotifications.description')}
							value={field.value}
							onChange={value => onChange('siteNotifications', value)}
							isDisabled={isLoadingUpdate}
						/>
					)}/>
					<FormField control={form.control} name="telegramNotifications" render={({field}) => (
						<ToggleCard
							heading={t('telegramNotifications.heading')}
							description={t('telegramNotifications.description')}
							value={field.value}
							onChange={value => onChange('telegramNotifications', value)}
							isDisabled={isLoadingUpdate}
						/>
					)}/>
				</Form>
	)
}
