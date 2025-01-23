"use client"
import React, {useState} from 'react'
import AuthWrapper from "@/components/features/auth/AuthWrapper";
import {createAccountSchema, TypeCreateAccountSchema} from "@/schemas/auth/create-account.schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/Form";
import {Input} from "@/components/ui/common/input";
import { Button } from '@/components/ui/common/Button';
import {useCreateUserMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/common/alert";
import {CircleCheck} from "lucide-react";
import {useTranslations} from "next-intl";

export default function CreateAccountForm() {
    const t = useTranslations('auth.register')
    const [isSuccess, setIsSuccess] = useState(false)
    const form = useForm<TypeCreateAccountSchema>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });
    const [create, {loading: isLoadingCreate}] = useCreateUserMutation({
        onCompleted() {
            setIsSuccess(true)
        },
        onError() {
            toast.error(t('errorMessage'));
        }
    })
    const { isValid } = form.formState

    function onSubmit(data: TypeCreateAccountSchema) {
        create({variables: {data}})
    }
     return (
        <AuthWrapper heading={t('heading')} backButtonHref="/account/login" backButtonLabel={t('backButtonLabel')}>
            {isSuccess ? (<Alert>
                <CircleCheck className="size-4"/>
                <AlertTitle>{t('successAlertTitle')}</AlertTitle>
                <AlertDescription>{t('successAlertDescription')}</AlertDescription>
            </Alert>) : (<Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
                    <FormField control={form.control} name="username" render={({field}) => <FormItem>
                        <FormLabel>
                            {t('usernameLabel')}
                        <FormControl>
                            <Input  placeholder='johndoe' disabled={isLoadingCreate} {...field}></Input>
                        </FormControl>
                        </FormLabel>
                        <FormDescription>
                            {t('usernameDescription')}
                        </FormDescription>
                    </FormItem>}/>
                    <FormField control={form.control} name="email" render={({field}) => <FormItem>
                        <FormLabel>
                            {t('emailLabel')}
                        <FormControl>
                            <Input placeholder='john.doe@example.com' disabled={isLoadingCreate} {...field}></Input>
                        </FormControl>
                        </FormLabel>
                         <FormDescription>
                            {t('emailDescription')}
                        </FormDescription>
                    </FormItem>}/>
                    <FormField control={form.control} name="password" render={({field}) => <FormItem>
                        <FormLabel>
                            {t('passwordLabel')}
                            <FormControl>
                                <Input placeholder='********' type="password" disabled={isLoadingCreate} {...field}></Input>
                            </FormControl>
                        </FormLabel>
                        <FormDescription>
                            {t('passwordDescription')}
                        </FormDescription>
                    </FormItem>}/>
                    <Button className="nt-2 w-full" disabled={!isValid || isLoadingCreate}>{t('submitButton')}</Button>
                </form>
            </Form>)}
        </AuthWrapper>
    )
}
