'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { useForm } from 'react-hook-form'
import { changePasswordSchema,type TypeChangePasswordSchema } from '@/schemas/user/change-password.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useChangePasswordMutation } from '@/graphql/generated/output'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/common/skeleton'
import FormWrapper from '@/components/ui/elements/FormWrapper'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/common/Form'
import { Input } from '@/components/ui/common/input'
import { Separator } from '@/components/ui/common/separator'
import { Button } from '@/components/ui/common/Button'

export default function ChangePasswordForm() {
	const t = useTranslations('dashboard.settings.account.password')
	const { isLoadingProfile, refetch } = useCurrent()
	const form = useForm<TypeChangePasswordSchema>({
		resolver: zodResolver(changePasswordSchema),
		values: {
			oldPassword:'',
			newPassword:'',
		}
	})
	function onSubmit(data: TypeChangePasswordSchema) {
		update({ variables: {data}})
	}

	const [update, { loading: isLoadingUpdate }] =
		useChangePasswordMutation({
			onCompleted() {
				refetch()
				form.reset()
				toast.success(t('successMessage'))
			},
			onError() {
				toast.error(t('errorMessage'))
			}
		})

	const {isValid} = form.formState
	return isLoadingProfile ? <ChangePasswordFormSkeleton/> : (
		<FormWrapper heading={t('heading')}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
					<FormField
						control={form.control}
						name="oldPassword"
						render={({field}) =>
							<FormItem className="px-5">
								<FormLabel>
									{t('oldPasswordLabel')}
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											disabled={isLoadingUpdate}
											{...field}/>
									</FormControl>
								</FormLabel>
								<FormDescription>
									{t('oldPasswordDescription')}
								</FormDescription>
							</FormItem>}
					/>
					<Separator/>
					<FormField
						control={form.control}
						name="newPassword"
						render={({field}) =>
							<FormItem className="px-5">
								<FormLabel>
									{t('newPasswordLabel')}
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											disabled={isLoadingUpdate}
											{...field}/>
									</FormControl>
								</FormLabel>
								<FormDescription>
									{t('newPasswordDescription')}
								</FormDescription>
							</FormItem>}
					/>
					<Separator/>
					<div className="flex justify-end p-5">
						<Button disabled={!isValid  || isLoadingUpdate}>{t('submitButton')}</Button>
					</div>
				</form>
			</Form>
		</FormWrapper>
	)
}

export function ChangePasswordFormSkeleton() {
	return (
		<Skeleton className="w-full h-96"/>
	)
}
