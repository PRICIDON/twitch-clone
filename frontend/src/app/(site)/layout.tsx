import type { Metadata } from "next";

import {PropsWithChildren} from "react";
import Header from "@/components/features/layout/header/Header";
import LayoutContainer from '@/components/features/layout/LayoutContainer'
import Sidebar from '@/components/features/layout/sidebar/Sidebar'


export default async function SiteLayout({
  children,
}: PropsWithChildren<unknown>) {
   return <div className="flex h-full flex-col">
       <div className="flex-1">
           <div className="fixed inset-y-0 z-50 h-[75px] w-full">
                <Header />
           </div>
           <Sidebar />
           <LayoutContainer>{children}</LayoutContainer></div>
   </div>
}
