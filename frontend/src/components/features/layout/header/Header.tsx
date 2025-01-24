import React from 'react'
import Logo from "@/components/features/layout/header/Logo";
import Search from "@/components/features/layout/header/Search";
import HeaderMenu from '@/components/features/layout/header/HeaderMenu'

export default function Header() {
    return (
        <header className="flex h-full items-center gap-x-4 border-b border-border bg-card p-4">
            <Logo />
            <Search/>
            <HeaderMenu/>
        </header>
    )
}
