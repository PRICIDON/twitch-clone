'use client'
import React, {useState} from 'react'
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLoginUserMutation, useNewPasswordMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import AuthWrapper from "@/components/features/auth/AuthWrapper";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/common/alert";
import {CircleCheck} from "lucide-react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/Form";
import {Input} from "@/components/ui/common/input";
import {Button} from "@/components/ui/common/Button";
import {useParams, useRouter} from "next/navigation";
import {loginSchema, TypeLoginSchema} from "@/schemas/auth/login.schema";
import {newPasswordSchema, TypeNewPasswordSchema} from "@/schemas/auth/new-password.schema";

export default function NewPasswordForm() {
    const t = useTranslations('auth.newPassword')


	const router = useRouter()
    const params = useParams<{token: string}>()

	const form = useForm<TypeNewPasswordSchema>({
		resolver: zodResolver(newPasswordSchema),
		defaultValues: {
			password: '',
            passwordRepeat: ""
		}
	})

	const [newPassword, { loading: isLoadingNew }] = useNewPasswordMutation({
		onCompleted(data) {
			toast.success(t('successMessage'))
            router.push('/account/login')
		},
		onError() {
			toast.error(t('errorMessage'))
		}
	})

	const { isValid } = form.formState

	function onSubmit(data: TypeNewPasswordSchema) {
		newPassword({ variables: { data: {...data, token: params.token } } })
	}
     return (
        <AuthWrapper heading={t('heading')} backButtonHref="/account/login" backButtonLabel={t('backButtonLabel')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
                    <FormField control={form.control} name="password" render={({field}) => <FormItem>
                        <FormLabel>
                            {t('passwordLabel')}
                        <FormControl>
                            <Input placeholder='********'
												type='password' disabled={isLoadingNew} {...field}></Input>
                        </FormControl>
                        </FormLabel>
                         <FormDescription>
                            {t('passwordDescription')}
                        </FormDescription>
                    </FormItem>}/>
                    <FormField control={form.control} name="passwordRepeat" render={({field}) => <FormItem>
                        <FormLabel>
                            {t('passwordRepeatLabel')}
                        <FormControl>
                            <Input placeholder='********'
												type='password' disabled={isLoadingNew} {...field}></Input>
                        </FormControl>
                        </FormLabel>
                         <FormDescription>
                            {t('passwordRepeatDescription')}
                        </FormDescription>
                    </FormItem>}/>

                    <Button className="nt-2 w-full" disabled={!isValid || isLoadingNew}>{t('submitButton')}</Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}
