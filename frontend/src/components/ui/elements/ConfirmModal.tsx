'use client'
import type { PropsWithChildren } from 'react'
import { useTranslations } from 'next-intl'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	 AlertDialogCancel, AlertDialogTrigger
} from '../common/alert-dialog'

interface ConfirmModalProps {
	heading: string
	message: string
	onConfirm: () => void
}

export default function ConfirmModal({message, heading, children, onConfirm} : PropsWithChildren<ConfirmModalProps>) {
	const t = useTranslations('components.confirmModal')
	return (
		<AlertDialog>
		  <AlertDialogTrigger asChild>
			  {children}
		  </AlertDialogTrigger>
		  <AlertDialogContent>
			<AlertDialogHeader>
			  <AlertDialogTitle>{heading}</AlertDialogTitle>
			  <AlertDialogDescription>
				  {message}
			  </AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
			  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
			  <AlertDialogAction onClick={onConfirm}>{t('continue')}</AlertDialogAction>
			</AlertDialogFooter>
		  </AlertDialogContent>
		</AlertDialog>
	)
}
