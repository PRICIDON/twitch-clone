import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import KeysSettings from '@/components/features/keys/settings/KeysSettings'
import { NO_INDEX_PAGE } from '@/libs/constants/seo.constants'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("dashboard.keys")
    return {
        title: t('header.heading'),
		description: t('header.description'),
		...NO_INDEX_PAGE
    }
}

export default function KeysPage() {
	return <KeysSettings/>
}
