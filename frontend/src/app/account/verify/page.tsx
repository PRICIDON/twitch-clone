import React from 'react'
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";
import VerifyAccountForm from "@/components/features/auth/forms/VerifyAccountForm";


export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("auth.register")
    return {
        title: t('heading')
    }
}

export default async function VerifyPage(props: {
    searchParams: Promise<{token: string}>
}) {
    const searchParams = await props.searchParams
    if (!searchParams.token) return redirect(`/account/create`);


    return <VerifyAccountForm />
}
