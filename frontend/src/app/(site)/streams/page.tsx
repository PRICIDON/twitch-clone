import {FindAllStreamsDocument, type FindAllStreamsQuery } from '@/graphql/generated/output'
import { SERVER_URL } from '@/libs/constants/url.constants'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import StreamContent from '@/components/features/stream/list/StreamContent'
import { getMediaSource } from '@/utils/get-media-source'

export async function generateMetadata(props: {
    searchParams: Promise<{searchTerm: string}>,
}): Promise<Metadata> {
    const searchParams = await props.searchParams
    const t = await getTranslations('streams')
	return {
		title: searchParams.searchTerm ? `${t('searchHeading')} "${searchParams.searchTerm}"` : t('heading'),
	}
}

async function findAllStreams() {
    try {
        const query= FindAllStreamsDocument.loc?.source.body
        const variables = {
            filters: {}
        }
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables }),
            next: {
                revalidate: 30
            }
        })
        const data = await response.json()
        return {
            streams: data.data.findAllStreams as FindAllStreamsQuery['findAllStreams'],
        }
    } catch (e) {
        console.log(e)
        throw new Error("Ошибка при получении стримов")
    }
}

export default async function StreamsPage() {
    const t = await getTranslations('streams')

    const {streams} = await findAllStreams()
    return (
          <StreamContent streams={streams} />
    );
}
