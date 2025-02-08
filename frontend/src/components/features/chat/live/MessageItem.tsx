import React from 'react'
import {  FindChatMessagesByStreamQuery } from '@/graphql/generated/output'
import { stringToColor } from '@/utils/color'
import { Medal } from 'lucide-react'

interface MessagesItemProps {
	data: FindChatMessagesByStreamQuery['findChatMessagesByStream'][0]
	isSponsor: boolean
}

export default function MessageItem({data, isSponsor}: MessagesItemProps) {
	const color = stringToColor(data.user.username ?? '')
	const formattedTime = new Date(data.createdAt).toLocaleTimeString([], {
		hour:'2-digit',
		minute:'2-digit',
	})
	return (
		<div className="flex gap-2 rounded-md padding-2 hover:bg-accent">
			<p className="text-sm text-muted-foreground">{formattedTime}</p>
			<div className="flex grow flex-wrap items-baseline gap-1">
				<p className="flex items-center whitespace-nowrap text-sm font-semibold">
					<span className="truncate" style={{color}}>{data.user.username}</span>
					{isSponsor && (
						<Medal className="ml-1 size-3.5" style={{color}}/>
					)}
				</p>
				<p className="break-all text-sm">{data.text}</p>
			</div>
		</div>
	)
}
