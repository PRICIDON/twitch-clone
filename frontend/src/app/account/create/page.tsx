

import React from 'react'
import {Metadata} from "next";
import CreateAccountForm from "@/components/features/auth/forms/CreateAccountForm";
import {getTranslations} from "next-intl/server";



export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("auth.register")
    return {
        title: t('heading')
    }
}

export default function page() {
    return (
        <CreateAccountForm/>
    )
}
