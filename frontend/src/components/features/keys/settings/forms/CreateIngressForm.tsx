'use client'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { useForm } from 'react-hook-form'
import { createIngressSchema, IngressType, type TypeCreateIngressSchema } from '@/schemas/stream/create-ingress.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateIngressMutation } from '@/graphql/generated/output'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/common/dialog'
import { Button } from '@/components/ui/common/Button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/common/Form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/common/select'

export default function CreateIngressForm() {
	const t = useTranslations('dashboard.keys.createModal')
	const [isOpen, setIsOpen] = useState(false)
	const {refetch} = useCurrent()
	const form = useForm<TypeCreateIngressSchema>({
		resolver: zodResolver(createIngressSchema),
		defaultValues: {
			ingressType: IngressType.RTMP
		}
	})
	const [create, { loading: isLoadingCreate}] = useCreateIngressMutation({
		onCompleted() {
			refetch()
			setIsOpen(false)
			toast.success(t('successMessage'))
		},
		onError() {
			toast.error(t('errorMessage'))
		}
	})
	const {isValid} = form.formState
	function onSubmit(data: TypeCreateIngressSchema) {
		create({variables: { ingressType: data.ingressType }})
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
						<FormField control={form.control} name='ingressType' render={({field}) => (
							<FormItem>
								<FormLabel>{t('ingressTypeLabel')}</FormLabel>
								<FormControl>
									<Select onValueChange={value => {
										field.onChange(Number(value))
									}} defaultValue={field.value.toString()}>
										<SelectTrigger>
											<SelectValue placeholder={t('ingressTypePlaceholder')}/>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={IngressType.RTMP.toString()} disabled={isLoadingCreate}>RTMP</SelectItem>
											<SelectItem value={IngressType.WHIP.toString()} disabled={isLoadingCreate}>WHIP</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>{t('ingressTypeDescription')}</FormDescription>
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
