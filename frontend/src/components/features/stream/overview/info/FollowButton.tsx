import React from 'react'
import {
	FindChannelByUsernameQuery,
	useFindMyFollowingsQuery,
	useFollowChannelMutation, useUnfollowChannelMutation
} from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCurrent } from '@/hooks/useCurrent'
import { Button } from '@/components/ui/common/Button'
import { Heart,HeartOff } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmModal from '@/components/ui/elements/ConfirmModal'

interface FollowButtonProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export default function FollowButton({channel}: FollowButtonProps) {
	const t = useTranslations('stream.actions.follow')
	const router = useRouter()

	const {isAuthenticated} = useAuth()
	const { user, isLoadingProfile } = useCurrent()

	const {data, loading: isLoadingFollowings, refetch} = useFindMyFollowingsQuery({
		skip: !isAuthenticated
	})
	const followings = data?.findMyFollowings

	const [follow, {loading: isLoadingFollow}] = useFollowChannelMutation({
		onCompleted() {
			refetch()
			toast.success(t('successFollowMessage'))
		},
		onError() {
			toast.error(t('errorFollowMessage'))
		}
	})
	const [unfollow, {loading: isLoadingUnfollow}] = useUnfollowChannelMutation({
		onCompleted() {
			refetch()
			toast.success(t('successUnfollowMessage'))
		},
		onError() {
			toast.error(t('errorUnfollowMessage'))
		}
	})

	const isOwnerChannel = user?.id === channel.id
	const isExistingFollow = followings?.some(following => following.followingId === channel.id)

	if (isOwnerChannel || isLoadingProfile) return null

	return isExistingFollow ? (
		<ConfirmModal heading={t('confirmUnfollowHeading')} message={t('confirmUnfollowMessage')} onConfirm={() => unfollow({variables: {channelId: channel.id}})}>
			<Button disabled={isLoadingFollowings || isLoadingUnfollow}>
				<HeartOff className="size-4"/>
				{t('unfollowButton')}
			</Button>
		</ConfirmModal>
	) : (
		<Button disabled={isLoadingFollowings || isLoadingFollow} onClick={() => isAuthenticated ? follow({variables: {channelId: channel.id}}) : router.push('/account/login')}>
			<Heart className="size-4"/>
			{t('followButton')}
		</Button>
	)
}
