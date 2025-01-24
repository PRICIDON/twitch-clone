'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Button } from '@/components/ui/common/Button'
import ProfileMenu from '@/components/features/layout/header/ProfileMenu'

export default function HeaderMenu() {
	const t = useTranslations('layout.header.headerMenu')
	const { isAuthenticated } = useAuth()
	return (
		<div className="ml-auto flex items-center gap-x-4">
			{isAuthenticated ? <ProfileMenu/> : (
				<>
					<Link href="/account/login">
						<Button variant='secondary'>{t('login')}</Button>
					</Link>
					<Link href='/account/create'>
						<Button variant='secondary'>{t('register')}</Button>
					</Link>
				</>
			)}
		</div>
	)
}
