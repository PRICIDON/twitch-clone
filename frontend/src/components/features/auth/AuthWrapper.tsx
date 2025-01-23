import React, {PropsWithChildren} from 'react'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/common/Card";
import {Button} from "@/components/ui/common/Button";
import Link from "next/link";
import {LogoImage} from "@/components/images/LogoImage";
interface AuthWrapperProps {
    heading: string
    backButtonLabel?: string
    backButtonHref?: string

}

export default function AuthWrapper({children, backButtonHref, backButtonLabel, heading} : PropsWithChildren<AuthWrapperProps>) {
    return (
        <div className="flex h-full items-center justify-center">
            <Card className="w-[450px]">
                <CardHeader className="flex-row items-center justify-center gap-x-4">
                    <LogoImage/>
                    <CardTitle>{heading}</CardTitle>
                </CardHeader>
                <CardContent>{children}</CardContent>
                <CardFooter className="-mt-2">
                    {backButtonHref && backButtonLabel && (
                        <Button variant='ghost' className="w-full">
                            <Link href={backButtonHref}>{backButtonLabel}</Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
