import React from 'react'
import { notFound } from 'next/navigation'
import {
	FindCategoryBySlugDocument,type FindCategoryBySlugQuery
} from '@/graphql/generated/output'
import { SERVER_URL } from '@/libs/constants/url.constants'
import { Metadata } from 'next'
import { getMediaSource } from '@/utils/get-media-source'
import CategoryOverview from '@/components/features/category/overview/CategoryOverview'

async function findCategoryBySlug(params: { slug:string}) {
	try {
		const query= FindCategoryBySlugDocument.loc?.source.body
		const variables = {slug: params.slug}
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query,variables }),
            next: {
                revalidate: 30
            }
        })
        const data = await response.json()
        return {
            category: data.data.findCategoryBySlug as FindCategoryBySlugQuery['findCategoryBySlug'],
        }
	} catch (e) {
		return notFound()
	}
}

export async function generateMetadata(props: {
	params: Promise<{slug: string}>
}) : Promise<Metadata> {
	const params = await props.params
	const { category } = await findCategoryBySlug(params)
	return {
		title: category.title,
		description: category.description,
		openGraph: {
			images: [
				{
					url: getMediaSource(category.thumbnailUrl),
					alt: category.title,
				}
			]
		}
	}
}

export default async function CategoryPage(props: {
	params: Promise<{slug: string}>
}) {
	const params = await props.params
	const { category } = await findCategoryBySlug(params)
	return (
		<CategoryOverview category={category} />
	)
}
