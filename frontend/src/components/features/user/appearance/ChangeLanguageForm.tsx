'use client'
import React, { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changeLanguageSchema, type TypeChangeLanguageSchema } from '@/schemas/user/change-language.schema'
import CardContainer from '@/components/ui/elements/CardContainer'
import { Form, FormField } from '@/components/ui/common/Form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/common/select'
import { setLanguage } from '@/libs/i18n/language'
import { toast } from 'sonner'

const languages = {
	ru: 'Русский',
	en: 'English',
}

export default function ChangeLanguageForm() {
	const t = useTranslations('dashboard.settings.appearance.language')

	const [isPending, startTransition] = useTransition()
	const locale = useLocale()

	const form = useForm<TypeChangeLanguageSchema>({
		resolver: zodResolver(changeLanguageSchema),
		values: {
			language: locale as TypeChangeLanguageSchema['language'],
		}
	})

	function onSubmit(data: TypeChangeLanguageSchema) {
		startTransition(async () => {
			try {
				await setLanguage(data.language)
			} catch (err) {
				toast.success(t('successMessage'))
			}

		})
	}

	return (
		<CardContainer
			heading={t('heading')}
			description={t('description')}
			rightContent={
				<Form {...form}>
					<FormField control={form.control} name='language' render={({field}) => (
						<Select onValueChange={value => {
							field.onChange(value)
							form.handleSubmit(onSubmit)()
						}} value={field.value}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder={t('selectPlaceholder')}/>
							</SelectTrigger>
							<SelectContent>
								{Object.entries(languages).map(([code, name]) => (
									<SelectItem value={code} key={code} disabled={isPending}>{name}</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}/>
				</Form>
			}
		/>
	)
}
