'use client'

import React, { ChangeEvent, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import { Skeleton } from '@/components/ui/common/skeleton'
import { useForm } from 'react-hook-form'
import { TypeUploadFileSchema, UploadFileSchema } from '@/schemas/auth/upload-file.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { getMediaSource } from '@/utils/get-media-source'
import FormWrapper from '@/components/ui/elements/FormWrapper'
import Form from 'next/form'
import { FormField } from '@/components/ui/common/Form'
import { ChannelAvatar } from '@/components/ui/elements/ChannelAvatar'
import { Button } from '@/components/ui/common/Button'
import { useChangeProfileAvatarMutation } from '@/graphql/generated/output'
import { toast } from 'sonner'

export default function ChangeAvatarForm() {
	const t = useTranslations('dashboard.settings.profile.avatar')
	const {user, isLoadingProfile, refetch} = useCurrent()
	const inputRef = useRef<HTMLInputElement>(null)
	const form = useForm<TypeUploadFileSchema>({
		resolver: zodResolver(UploadFileSchema),
		values: {
			file: user?.avatar!
		}
	})
	// TODO: 5:45:33
	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		if(file) {
			form.setValue('file', file)
			update({ variables: { avatar: file } })
		}
	}
	const [update, {loading: isLoadingUpdate}] = useChangeProfileAvatarMutation({
		onCompleted(){
			refetch()
			toast.success(t('successUpdateMessage'))
		},
		onError(){
			toast.error(t('errorUpdateMessage'))
		}
	})

	return isLoadingProfile ? (
		<ChangeAvatarFormSkeleton/>
	) : (
		<FormWrapper heading={t('heading')}>
			<Form action={''} {...form}>
				<FormField control={form.control} name="file" render={({field}) => <div className="px-5 pb-5">
					<div className="w-full items-center lg:flex space-x-6">
						<ChannelAvatar channel={{
							username: user?.username,
							avatar: field.value instanceof File ? URL.createObjectURL(field.value) : field.value,
						}} size="xl"/>
						<div className="space-y-3">
							<div className="flex items-center gap-x-3">
								<input type="file" className="hidden" ref={inputRef} onChange={handleImageChange}/>
								<Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={isLoadingUpdate}>
									{t('updateButton')}
								</Button>
							</div>
							<p className="text-sm text-muted-foreground">{t('info')}</p>
						</div>
					</div>
				</div>}></FormField>
			</Form>
		</FormWrapper>
	)
}

export function ChangeAvatarFormSkeleton() {
	return (
		<Skeleton className="w-full h-52 "/>
	)
}
