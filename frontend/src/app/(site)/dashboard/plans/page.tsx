import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import SponsorsTable from '@/components/features/sponsorship/subscription/table/SponsorsTable'
import PlansTable from '@/components/features/sponsorship/plans/table/PlansTable'
import { NO_INDEX_PAGE } from '@/libs/constants/seo.constants'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("dashboard.plans")
    return {
        title: t('header.heading'),
		description: t('header.description'),
		...NO_INDEX_PAGE
    }
}

export default function PlansPage() {
	return <PlansTable/>
}
