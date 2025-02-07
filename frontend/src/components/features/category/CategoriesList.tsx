import React from 'react'
import type { FindRandomCategoriesQuery } from '@/graphql/generated/output'
import EmptyState from '@/components/ui/elements/EmptyState'
import { Heading } from '@/components/ui/elements/Heading'
import CategoryCard from '@/components/features/category/CategoryCard'

interface CategoriesListProps {
	heading?: string
	categories: FindRandomCategoriesQuery['findRandomCategories']
}

export default function CategoriesList({ heading, categories }: CategoriesListProps) {

	return categories.length ? (
		<>
			{heading && <Heading title={heading} />}
			<div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
				{categories.map((category, i) => (
					<CategoryCard key={i} category={category} />
				))}
			</div>
		</>
	) : <EmptyState/>
}
