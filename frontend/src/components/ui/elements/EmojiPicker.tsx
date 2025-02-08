import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/common/popover'
import { Smile } from 'lucide-react'
import Picker, { type EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

interface EmojiPickerProps {
	onChange: (value: string) => void;
	isDisabled: boolean;
}

export default function EmojiPicker({ onChange,isDisabled }: EmojiPickerProps) {
	const t = useTranslations('stream.chat.sendMessage')
	const { theme } = useTheme()
	return (
		<Popover>
			<PopoverTrigger className='disabled:cursor-not-allowed' disabled={isDisabled}>
				<Smile className="size-22"/>
			</PopoverTrigger>
			<PopoverContent side='top' className={"mb-4 mr-28 p-0"}>
				<Picker
					onEmojiClick={(emoji: EmojiClickData) => onChange(emoji.emoji)}
					emojiStyle={EmojiStyle.APPLE}
					searchPlaceholder={t('emojiPlaceholder')}
					theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
				/>
			</PopoverContent>
		</Popover>
	)
}
