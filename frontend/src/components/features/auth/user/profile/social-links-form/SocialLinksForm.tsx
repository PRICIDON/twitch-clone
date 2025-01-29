'use client'
import React from 'react'
import { useTranslations } from 'next-intl'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	useCreateSocialLinkMutation,
	useFindSocialLinksQuery
} from '@/graphql/generated/output'
import { socialLinksSchema, type TypeSocialLinksSchema } from '@/schemas/user/social-links.schema'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/common/skeleton'
import FormWrapper from '@/components/ui/elements/FormWrapper'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/common/Form'
import { Input } from '@/components/ui/common/input'
import { Separator } from '@/components/ui/common/separator'
import { Button } from '@/components/ui/common/Button'
import SocialLinksList from '@/components/features/auth/user/profile/social-links-form/SocialLinksList'

export default function SocialLinksForm() {
	const t = useTranslations('dashboard.settings.profile.socialLinks.createForm')

	const { loading: isLoadingLinks,refetch } = useFindSocialLinksQuery()

	const form = useForm<TypeSocialLinksSchema>({
		resolver: zodResolver(socialLinksSchema),
		values: {
			title: '',
			url: ''
		}
	})

	const [create, { loading: isLoadingCreate }] =
		useCreateSocialLinkMutation({
			onCompleted() {
				form.reset()
				refetch()
				toast.success(t('successMessage'))
			},
			onError() {
				toast.error(t('errorMessage'))
			}
		})

	function onSubmit(data: TypeSocialLinksSchema) {
		create({ variables: {data}})
	}
	const {isValid} = form.formState

	//TODO: 6:25:42

	return isLoadingLinks ? <SocialLinksFormSkeleton/> : (
		<FormWrapper heading={t('heading')}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
					<FormField
						control={form.control}
						name="title"
						render={({field}) =>
							<FormItem className="px-5">
								<FormLabel>
									{t('titleLabel')}
									<FormControl>
										<Input
											placeholder={t('titlePlaceholder')}
											disabled={isLoadingCreate}
											{...field}/>
									</FormControl>
								</FormLabel>
								<FormDescription>
									{t('titleDescription')}
								</FormDescription>
							</FormItem>}
					/>
					<Separator />
					<FormField
						control={form.control}
						name="url"
						render={({field}) =>
							<FormItem className="px-5">
								<FormLabel>
									{t('urlLabel')}
									<FormControl>
										<Input
											placeholder={t('urlPlaceholder')}
											disabled={isLoadingCreate}
											{...field}/>
									</FormControl>
								</FormLabel>
								<FormDescription>
									{t('urlDescription')}
								</FormDescription>
							</FormItem>}
					/>
					<Separator/>
					<div className="flex justify-end p-5">
						<Button disabled={!isValid || isLoadingCreate}>{t('submitButton')}</Button>
					</div>
				</form>
			</Form>
			<SocialLinksList />
		</FormWrapper>
	)
}

export function SocialLinksFormSkeleton() {
	return <Skeleton className="w-full h-72"/>
}
