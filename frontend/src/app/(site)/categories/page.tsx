import {
    FindAllCategoriesDocument,
    FindAllCategoriesQuery,
} from '@/graphql/generated/output'
import { SERVER_URL } from '@/libs/constants/url.constants'
import { getTranslations } from 'next-intl/server'
import CategoriesList from '@/components/features/category/CategoriesList'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("categories")
    return {
        title: t('heading'),
    }
}

async function findAllCategories() {
    try {
        const query= FindAllCategoriesDocument.loc?.source.body
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query }),
            next: {
                revalidate: 30
            }
        })
        const data = await response.json()
        return {
            categories: data.data.findAllCategories as FindAllCategoriesQuery['findAllCategories'],
        }
    } catch (e) {
        console.error(e)
        throw Error("Ошибка при получении категории")
    }
}

export default async function CategoriesPage() {
    const t = await getTranslations('categories')

    const {categories} = await findAllCategories()
  return (
      <CategoriesList heading={t('heading')} categories={categories}/>
  );
}
