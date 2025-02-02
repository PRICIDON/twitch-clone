import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import KeysSettings from '@/components/features/keys/settings/KeysSettings'
import ChangeChatSettings from '@/components/features/chat/settings/ChangeChatSettings'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("dashboard.chat")
    return {
        title: t('header.heading'),
		description: t('header.description'),
		robots: {
			index: false,
			follow: false,
		}
    }
}

export default function ChatPage() {
	return <ChangeChatSettings />
}
