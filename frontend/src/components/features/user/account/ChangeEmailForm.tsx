'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { useForm } from 'react-hook-form'
import { changeEmailSchema, TypeChangeEmailSchema } from '@/schemas/user/change-email.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useChangeEmailMutation } from '@/graphql/generated/output'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/common/skeleton'
import FormWrapper from '@/components/ui/elements/FormWrapper'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/common/Form'
import { Input } from '@/components/ui/common/input'
import { Separator } from '@/components/ui/common/separator'
import { Button } from '@/components/ui/common/Button'

export default function ChangeEmailForm() {
	const t = useTranslations('dashboard.settings.account.email')
	const { user, isLoadingProfile, refetch } = useCurrent()
	const form = useForm<TypeChangeEmailSchema>({
		resolver: zodResolver(changeEmailSchema),
		values: {
			email: user?.email ?? '',
		}
	})
	function onSubmit(data: TypeChangeEmailSchema) {
		update({ variables: {data}})
	}

	const [update, { loading: isLoadingUpdate }] =
		useChangeEmailMutation({
			onCompleted() {
				refetch()
				toast.success(t('successMessage'))
			},
			onError() {
				toast.error(t('errorMessage'))
			}
		})

	const {isValid, isDirty} = form.formState
	return isLoadingProfile ? <ChangeEmailFormSkeleton/> : (
		<FormWrapper heading={t('heading')}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
					<FormField
						control={form.control}
						name="email"
						render={({field}) =>
							<FormItem className="px-5">
								<FormLabel>
									{t('emailLabel')}
									<FormControl>
										<Input
											placeholder="johndoe@example.com"
											disabled={isLoadingUpdate}
											{...field}/>
									</FormControl>
								</FormLabel>
								<FormDescription>
									{t('emailDescription')}
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

export function ChangeEmailFormSkeleton() {
	return (
		<Skeleton className="w-full h-64"/>
	)
}
