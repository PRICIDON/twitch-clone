'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changeInfoSchema, TypeChangeInfoSchema } from '@/schemas/user/change-info.schema'
import { Skeleton } from '@/components/ui/common/skeleton'
import FormWrapper from '@/components/ui/elements/FormWrapper'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/common/Form'
import { Input } from '@/components/ui/common/input'
import { Separator } from '@/components/ui/common/separator'
import { Textarea } from '@/components/ui/common/textarea'
import { Button } from '@/components/ui/common/Button'
import {  useChangeProfileInfoMutation } from '@/graphql/generated/output'
import { toast } from 'sonner'


export default function ChangeInfoForm() {
	const t = useTranslations('dashboard.settings.profile.info')
	const { user, isLoadingProfile, refetch } = useCurrent()
	const form = useForm<TypeChangeInfoSchema>({
		resolver: zodResolver(changeInfoSchema),
		values: {
			username: user?.username ?? '',
			displayName: user?.displayName ?? '',
			bio: user?.bio ?? '' ,
		}
	})
	function onSubmit(data: TypeChangeInfoSchema) {
		update({ variables: {data}})
	}

	const [update, { loading: isLoadingUpdate }] =
		useChangeProfileInfoMutation({
			onCompleted() {
				refetch()
				toast.success(t('successMessage'))
			},
			onError() {
				toast.error(t('errorMessage'))
			}
		})

	const {isValid, isDirty} = form.formState
	return isLoadingProfile ? <ChangeInfoFormSkeleton/> : (
		<FormWrapper heading={t('heading')}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
					<FormField
						control={form.control}
						name="username"
						render={({field}) =>
							<FormItem className="px-5">
								<FormLabel>
									{t('usernameLabel')}
									<FormControl>
										<Input
											placeholder={t('usernamePlaceholder')}
											disabled={isLoadingUpdate}
											{...field}/>
									</FormControl>
								</FormLabel>
								<FormDescription>
									{t('usernameDescription')}
								</FormDescription>
							</FormItem>}
					/>
					<Separator />
					<FormField
						control={form.control}
						name="displayName"
						render={({field}) =>
							<FormItem className="px-5">
								<FormLabel>
									{t('displayNameLabel')}
									<FormControl>
										<Input
											placeholder={t('displayNamePlaceholder')}
											disabled={isLoadingUpdate}
											{...field}/>
									</FormControl>
								</FormLabel>
								<FormDescription>
									{t('displayNameDescription')}
								</FormDescription>
							</FormItem>}
					/>
					<Separator />
					<FormField
						control={form.control}
						name="bio"
						render={({field}) =>
							<FormItem className="px-5">
								<FormLabel>
									{t('bioLabel')}
									<FormControl>
										<Textarea
											placeholder={t('bioPlaceholder')}
											disabled={isLoadingUpdate}
											{...field}/>
									</FormControl>
								</FormLabel>
								<FormDescription>
									{t('bioDescription')}
								</FormDescription>
							</FormItem>}
					/>
					<Separator/>
					<div className="flex justify-end p-5">
						<Button disabled={!isValid || !isDirty || isLoadingUpdate}>{t('submitButton')}</Button>
					</div>
				</form>
			</Form>
		</FormWrapper>
	)
}

export function ChangeInfoFormSkeleton() {
	return <Skeleton className="h-96 w-full"></Skeleton>
}
