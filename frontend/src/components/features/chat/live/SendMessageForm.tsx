import React from 'react'
import { FindChannelByUsernameQuery, useSendMessageMutation } from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { sendMessageSchema, type TypeSendMessageSchema } from '@/schemas/chat/send-message.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/common/Form'
import { Textarea } from '@/components/ui/common/textarea'
import { Button } from '@/components/ui/common/Button'
import { SendHorizonal } from 'lucide-react'
import EmojiPicker from '@/components/ui/elements/EmojiPicker'
import { toast } from 'sonner'

interface SendMessageFormProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
	isDisabled: boolean
}
export default function SendMessageForm({channel, isDisabled}: SendMessageFormProps) {
	const t = useTranslations('stream.chat.sendMessage')
	const form = useForm<TypeSendMessageSchema>({
		resolver: zodResolver(sendMessageSchema),
		defaultValues: {
			text: ''
		}
	})
	const [send, {loading: isLoadingSend}] = useSendMessageMutation({
		onError(){
			toast.error(t('errorMessage'))
		}
	})
	const { isValid } = form.formState
	function onSubmit(data: TypeSendMessageSchema) {
		send({
			variables: {
				data: {
					text: data.text,
					streamId: channel.stream.id
				}
			}
		})
		form.reset()
	}
	return (
		<Form {...form}>
			<form className="flex mt-3 items-center gap-x-4" onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="text"
					render={({field}) => (
					 	<FormItem className="w-60">
							<FormControl>
								<div className="relative">
									<Textarea
										onKeyDown={e => {
												if(e.key === 'Enter' && !e.shiftKey) {
													e.preventDefault()
													form.handleSubmit(onSubmit)()
												}
											}
										}
										rows={1}
										onInput={e => {
											e.currentTarget.style.height = 'auto'
											e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
										}}
										placeholder={t('placeholder')}
										className='min-h-[40px] resize-none pr-8'
										disabled={isDisabled}
										{...field}
									/>
									<div className="absolute right-2 top-2 cursor-pointer">
										<EmojiPicker isDisabled={isDisabled || isLoadingSend} onChange={emoji => field.onChange(`${field.value} ${emoji}`)} />
									</div>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type='submit' size='lgIcon' disabled={isDisabled || !isValid || isLoadingSend}>
					<SendHorizonal className="size-4"/>
				</Button>
			</form>
		</Form>
	)
}
