import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useFindSocialLinksQuery, useReorderSocialLinksMutation } from '@/graphql/generated/output'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { Separator } from '@/components/ui/common/separator'
import SocialLinkItem from '@/components/features/user/profile/social-links-form/SocialLinkItem'
import { toast } from 'sonner'

export default function SocialLinksList() {
	const t = useTranslations('dashboard.settings.profile.socialLinks')
	const {data, refetch} = useFindSocialLinksQuery()
	const items = data?.findSocialLinks ?? []
	const [socialLinks, setSocialLinks] = useState(items)
	useEffect(() => {
		setSocialLinks(items)
	}, [items])
	const [reorder, {loading: isLoadingReorder}] = useReorderSocialLinksMutation({
		onCompleted() {
			refetch()
			toast.success(t('successReorderMessage'))
		},
		onError() {
			toast.error(t('errorReorderMessage'))
		}
	})
	function onDragEnd(result: DropResult) {
		if(!result.destination) return
		const items = Array.from(socialLinks)
		const [reorderItem] = items.splice(result.source.index, 1)

		items.splice(result.destination.index, 0, reorderItem)
		const bulkUpdateData = items.map((socialLink, i) =>({
			id: socialLink.id,
			position: i
		}))
		setSocialLinks(items)
		console.log(bulkUpdateData)
		reorder({variables: {list: bulkUpdateData}})
	}
	return socialLinks.length ? (
		<>
			<Separator/>
			<div className="px-5 mt-5">
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId='socialLinks'>
						{provided => (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{socialLinks.map((socialLink, i) => (
									<Draggable key={i} draggableId={socialLink.id} index={i} isDragDisabled={isLoadingReorder}>
										{provided => (
											<SocialLinkItem key={i} provided={provided} socialLink={socialLink} />
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</>
	): null
}
