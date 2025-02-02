import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import FollowersTable from '@/components/features/followers/table/FollowersTable'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("dashboard.followers")
    return {
        title: t('header.heading'),
		description: t('header.description'),
		robots: {
			index: false,
			follow: false,
		}
    }
}

export default function FollowersPage() {
	return <FollowersTable></FollowersTable>
}
