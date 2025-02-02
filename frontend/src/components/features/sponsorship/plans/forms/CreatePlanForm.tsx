'use client'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateSponsorshipPlanMutation, useFindMySponsorshipPlansQuery } from '@/graphql/generated/output'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/common/dialog'
import { Button } from '@/components/ui/common/Button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/common/Form'
import { createPlanSchema, type TypeCreatePlanSchema } from '@/schemas/plan/create-plan.schema'
import { Input } from '@/components/ui/common/input'
import { Textarea } from '@/components/ui/common/textarea'

export default function CreatePlanForm() {
	const t = useTranslations('dashboard.plans.createForm')
	const [isOpen, setIsOpen] = useState(false)
	const {refetch} = useFindMySponsorshipPlansQuery()
	const form = useForm<TypeCreatePlanSchema>({
		resolver: zodResolver(createPlanSchema),
		defaultValues: {
			title: '',
			description: '',
			price: 0
		}
	})
	const [create, { loading: isLoadingCreate}] = useCreateSponsorshipPlanMutation({
		onCompleted() {
			refetch()
			form.reset()
			setIsOpen(false)
			toast.success(t('successMessage'))
		},
		onError() {
			toast.error(t('errorMessage'))
		}
	})
	const {isValid} = form.formState
	function onSubmit(data: TypeCreatePlanSchema) {
		create({variables: { data }})
	}
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger>
				<Button>{t('trigger')}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('heading')}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField control={form.control} name='title' render={({field}) => (
							<FormItem>
								<FormLabel>{t('titleLabel')}</FormLabel>
								<FormControl>
									<Input placeholder={t('titlePlaceholder')} disabled={isLoadingCreate} {...field}  />
								</FormControl>
								<FormDescription>{t('titleDescription')}</FormDescription>
							</FormItem>
						)}/>
						<FormField control={form.control} name='description' render={({field}) => (
							<FormItem>
								<FormLabel>{t('descriptionLabel')}</FormLabel>
								<FormControl>
									<Textarea placeholder={t('descriptionPlaceholder')} disabled={isLoadingCreate} {...field}  />
								</FormControl>
								<FormDescription>{t('descriptionDescription')}</FormDescription>
							</FormItem>
						)}/>
						<FormField control={form.control} name='price' render={({field}) => (
							<FormItem>
								<FormLabel>{t('priceLabel')}</FormLabel>
								<FormControl>
									<Input placeholder={t('priceLabel')} disabled={isLoadingCreate} type="number" {...field}  />
								</FormControl>
								<FormDescription>{t('priceDescription')}</FormDescription>
							</FormItem>
						)}/>
						<div className="flex justify-end">
							<Button disabled={!isValid || isLoadingCreate}>{t('submitButton')}</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
