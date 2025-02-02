import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { useEnableTotpMutation, useGenerateTotpSecretQuery } from '@/graphql/generated/output'
import { useForm } from 'react-hook-form'
import { enableTotpSchema, TypeEnableTotpSchema } from '@/schemas/user/enable-totp.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/common/dialog'
import { Button } from '@/components/ui/common/Button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/common/Form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/common/input-otp'
import { toast } from 'sonner'

export default function EnableTotp() {
	const t = useTranslations('dashboard.settings.account.twoFactor.enable')
	const [isOpen, setIsOpen] = useState(false)
	const { refetch } = useCurrent()
	const {data, loading: isLoadingGenerate} = useGenerateTotpSecretQuery()
	const twoFactorAuth = data?.generateTotpSecret
	const form = useForm<TypeEnableTotpSchema>({
		resolver: zodResolver(enableTotpSchema),
		defaultValues: {
			pin: ''
		}
	})
	const [enable, {loading: isLoadingEnable}] = useEnableTotpMutation({
		onCompleted() {
			refetch()
			setIsOpen(false)
			toast.success(t('successMessage'))
		},
		onError() {
			toast.error(t('errorMessage'))
		},
	})
	const {isValid} = form.formState
	function onSubmit(data: TypeEnableTotpSchema) {
		enable({variables: {
			data: {
				secret: twoFactorAuth?.secret ?? '',
				pin: data.pin,
			}
		}})
	}
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger>
				<Button>{t('trigger')}</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t('heading')}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="sm:max-w-md">
						<div className="flex flex-col items-center justify-center gap-4">
							<span className="text-sm text-muted-foreground">
								{twoFactorAuth?.qrcodeUrl ? t('qrInstructions') : ''}
							</span>
							<img src={twoFactorAuth?.qrcodeUrl} alt="qr" className="rounded-lg" />
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-center text-sm text-muted-foreground">
								{twoFactorAuth?.secret ? t('secretCodeLabel') + twoFactorAuth.secret : ''}
							</span>
						</div>
						<FormField
							control={form.control}
							name="pin"
							render={({field}) =>
								<FormItem className="flex flex-col justify-center max-sm:items-center">
									<FormLabel>
										{t('pinLabel')}
									</FormLabel>
									<FormControl>
											<InputOTP
												maxLength={6}
												{...field}
											>
													<InputOTPGroup>
														<InputOTPSlot index={0}></InputOTPSlot>
														<InputOTPSlot index={1}></InputOTPSlot>
														<InputOTPSlot index={2}></InputOTPSlot>
														<InputOTPSlot index={3}></InputOTPSlot>
														<InputOTPSlot index={4}></InputOTPSlot>
														<InputOTPSlot index={5}></InputOTPSlot>
													</InputOTPGroup>
											</InputOTP>
									</FormControl>
									<FormDescription>
										{t('pinDescription')}
									</FormDescription>
								</FormItem>}
						/>
						<DialogFooter>
							<Button type="submit" disabled={!isValid || isLoadingGenerate || isLoadingEnable}>
								{t('submitButton')}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
