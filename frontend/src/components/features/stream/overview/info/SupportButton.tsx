import React from 'react'
import {
	type FindChannelByUsernameQuery, useFindSponsorsByChannelQuery, useMakePaymentMutation
} from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCurrent } from '@/hooks/useCurrent'
import { Button } from '@/components/ui/common/Button'
import {  Medal } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/common/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/common/tabs'
import { convertPrice } from '@/utils/convert-price'

interface SupportButtonProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export default function SupportButton({channel}: SupportButtonProps) {
	const t = useTranslations('stream.actions.support')
	const router = useRouter()

	const {isAuthenticated} = useAuth()
	const { user, isLoadingProfile } = useCurrent()

	const {data} = useFindSponsorsByChannelQuery({
		skip: !isAuthenticated
	})
	const sponsors = data?.findSponsorsByChannel

	const [makePayment, {loading: isLoadingMakePayment}] = useMakePaymentMutation({
		onCompleted(data) {
			router.push(data.makePayment.url)
		},
		onError() {
			toast.error(t('errorMessage'))
		}
	})

	const isOwnerChannel = user?.id === channel.id
	const isSponsor = sponsors?.some(sponsor => sponsor.user.id === user?.id)

	if (isOwnerChannel || isLoadingProfile) return null

	if(isSponsor) return (
		<Button disabled variant='secondary'>
			<Medal className='size-4'/>
			{t('alreadySponsor')}
		</Button>
	)

	return isAuthenticated ? (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='secondary'>
					<Medal className='size-4'/>
					{t('supportAuthor')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Tabs defaultValue={channel.sponsorshipPlans[0].id}>
					<TabsList className="mb-1">
						{channel.sponsorshipPlans.map((plan, i) => (
							<TabsTrigger key={i} value={plan.id}>{plan.title}</TabsTrigger>
						))}
					</TabsList>
					{channel.sponsorshipPlans.map((plan, i) => (
						<TabsContent key={i} value={plan.id}>{plan.title}
							<DialogTitle className="text-2xl">
								{convertPrice(plan.price)}
							</DialogTitle>
							{plan.description && (
								<DialogDescription className="mt-2 text-sm">{plan.description}</DialogDescription>
							)}
							<Button
								className="mt-3 w-full"
								onClick={() => makePayment({ variables: { planId: plan.id } })}
								disabled={isLoadingMakePayment}
							>
								{t('choose')}
							</Button>
						</TabsContent>
					))}
				</Tabs>
			</DialogContent>
		</Dialog>
	) : (
		<Button onClick={() => router.push('/account/login')} variant='secondary'>
			<Medal className='size-4'/>
			{t('supportAuthor')}
		</Button>
	)
}
