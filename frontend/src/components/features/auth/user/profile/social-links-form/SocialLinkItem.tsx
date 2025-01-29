import React, { useState } from 'react'
import {
	FindSocialLinksQuery,
	useFindSocialLinksQuery,
	useRemoveSocialLinkMutation,
	useUpdateSocialLinkMutation
} from '@/graphql/generated/output'
import type { DraggableProvided } from '@hello-pangea/dnd'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { socialLinksSchema, type TypeSocialLinksSchema } from '@/schemas/user/social-links.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { Form, FormControl,FormField, FormItem, FormLabel } from '@/components/ui/common/Form'
import { Input } from '@/components/ui/common/input'

import { Button } from '@/components/ui/common/Button'
import { toast } from 'sonner'

interface SocialLinkItemProps {
	socialLink: FindSocialLinksQuery['findSocialLinks'][0]
	provided: DraggableProvided
}

export default function SocialLinkItem({socialLink, provided}: SocialLinkItemProps) {
	const t = useTranslations('dashboard.settings.profile.socialLinks.editForm')
	const {refetch} = useFindSocialLinksQuery()
	const [editingId, setEditingId] = useState<string | null>(null)
	const form = useForm<TypeSocialLinksSchema>({
		resolver: zodResolver(socialLinksSchema),
		values: {
			title: socialLink.title ?? '',
			url: socialLink.url ?? ''
		}
	})
	const {isValid, isDirty} = form.formState
	function toggleEditing(id: string | null) {
		setEditingId(id)
	}
	const [update, {loading: isLoadingUpdate}] = useUpdateSocialLinkMutation({
		onCompleted() {
			refetch()
			toggleEditing(null)
			toast.success('successUpdateMessage')
		},
		onError() {
			toast.error('errorUpdateMessage')
		}
	})
	const [remove, {loading: isLoadingRemove}] = useRemoveSocialLinkMutation({
		onCompleted() {
			refetch()
			toast.success('successRemoveMessage')
		},
		onError() {
			toast.error('errorRemoveMessage')
		}
	})
	function onSubmit(data: TypeSocialLinksSchema) {
		update({variables: { id: socialLink.id, data}})
	}
	return (
		<div className="mb-4 items-center flex gap-x-2 rounded-md border-border bg-background text-sm" ref={provided.innerRef} {...provided.draggableProps}>
			<div className="rounded-l-md border-r border-r-border px-2 py-2 text-foreground transition" {...provided.dragHandleProps}>
				<GripVertical className="size-5" />
			</div>
			<div className="space-y-1 px-2">
				{editingId === socialLink.id ? (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-x-6">
							<div className="w-96 space-y-2">
								<FormField
								control={form.control}
								name="title"
								render={({field}) =>
									<FormItem>
										<FormLabel>
											<FormControl>
												<Input
													placeholder='Youtube'
													className="h-8"
													disabled={isLoadingUpdate || isLoadingRemove}
													{...field}/>
											</FormControl>
										</FormLabel>
									</FormItem>}
								/>
								<FormField
									control={form.control}
									name="url"
									render={({field}) =>
										<FormItem>
											<FormLabel>
												<FormControl>
													<Input
														placeholder="https://youtube.com/@Pricidon"
														className="h-8"
														disabled={isLoadingUpdate || isLoadingRemove}
														{...field}/>
												</FormControl>
											</FormLabel>
										</FormItem>}
								/>
							</div>
							<div className="flex items-center gap-x-4">
								<Button onClick={() => toggleEditing(null)} variant="secondary">{t('cancelButton')}</Button>
								<Button disabled={isLoadingUpdate || isLoadingRemove || !isDirty || !isValid
								}>{t('submitButton')}</Button>
							</div>
						</form>
					</Form>
				) : (
					<>
						<h2 className="text-[17px] font-semibold text-foreground">{socialLink.title}</h2>
						<p className="text-muted-foreground">{socialLink.url}</p>
					</>
				)}
			</div>
			<div className="ml-auto flex items-center gap-x-2 pr-4">
				{editingId !== socialLink.id && (
					<Button onClick={() => toggleEditing(socialLink.id)} variant="ghost" size='lgIcon'>
						<Pencil className="size-4 text-muted-foreground"/>
					</Button>
				)}
				<Button onClick={() => remove({variables: {id: socialLink.id}})} variant="ghost" size='lgIcon'>
						<Trash2 className="size-4 text-muted-foreground"/>
				</Button>
			</div>
		</div>
	)
}
