import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import KeysSettings from '@/components/features/keys/settings/KeysSettings'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("dashboard.keys")
    return {
        title: t('header.heading'),
		description: t('header.description'),
		robots: {
			index: false,
			follow: false,
		}
    }
}

export default function KeysPage() {
	return <KeysSettings/>
}
