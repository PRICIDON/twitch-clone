'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useCurrent } from '@/hooks/useCurrent'
import VerifiedChannelAlert from '@/components/features/sponsorship/plans/table/VerifiedChannelAlert'
import { Heading } from '@/components/ui/elements/Heading'
import CreatePlanForm from '@/components/features/sponsorship/plans/forms/CreatePlanForm'
import {
	FindMySponsorshipPlansQuery,
	useFindMySponsorshipPlansQuery,
	useRemoveSponsorshipPlanMutation
} from '@/graphql/generated/output'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDate } from '@/utils/format-date'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/common/dropdown-menu'
import { Button } from '@/components/ui/common/Button'
import { MoreHorizontal, Trash } from 'lucide-react'
import { convertPrice } from '@/utils/convert-price'
import { toast } from 'sonner'
import { DataTable, DataTableSkeleton } from '@/components/ui/elements/DataTable'

export default function PlansTable() {
	const t = useTranslations("dashboard.plans")
	const { user} = useCurrent()
	const { data, loading: isLoadingPlans, refetch} = useFindMySponsorshipPlansQuery()
	const plans = data?.findMySponsorshipPlans ?? []
	const plansColumns: ColumnDef<FindMySponsorshipPlansQuery['findMySponsorshipPlans'][0]>[] = [
		{
			accessorKey: 'createdAt',
			header: t('columns.date'),
			cell: ({row}) => formatDate(row.original.createdAt)
		},
		{
			accessorKey: 'title',
			header: t('columns.title'),
			cell: ({row}) =>row.original.title,
		},
		{
			accessorKey: 'price',
			header: t('columns.price'),
			cell: ({row}) => convertPrice(row.original.price)
		},
		{
			accessorKey: 'actions',
			header: t('columns.actions'),
			cell: ({row}) => {
				const [remove, {loading: isLoadingRemove}] = useRemoveSponsorshipPlanMutation({
					onCompleted() {
						refetch()
						toast.success(t('columns.successMessage'))
					},
					onError() {
						toast.error(t('columns.errorMessage'))
					}
				})
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='size-8 p-0'>
								<MoreHorizontal className=""/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="right">
							<DropdownMenuItem
								onClick={() => remove({variables: {planId: row.original.id}})}
								className="text-red-500 focus:text-red-500"
								disabled={isLoadingRemove}
							>
								<Trash className="mr-2 size-4"/>
								{t('columns.remove')}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			}
		},
	]
	return user?.isVerified ? (
		<div className="lg:px-10">
			<div className="block items-center justify-between space-y-3 lg:flex lg:space-y-0">
				<Heading title={t('header.heading')} description={t('header.description')} size="lg" />
				<CreatePlanForm/>
			</div>
			<div className="mt-5">
				{isLoadingPlans ? (
					<DataTableSkeleton />
				): (
					<DataTable data={plans} columns={plansColumns} />
				)}
			</div>
		</div>
	) : <VerifiedChannelAlert/>
}
