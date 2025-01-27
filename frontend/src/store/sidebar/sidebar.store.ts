import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import {AuthStore} from "@/store/auth/auth.types";
import { SidebarStore } from '@/store/sidebar/sidebar.types'

export const sidebarStore = create(persist<SidebarStore>(
    set => ({
        isCollapsed: false,
        setIsCollapsed: (value: boolean) => set({isCollapsed: value}),
    }),
    {
        name: 'sidebar',
        storage: createJSONStorage(() => localStorage),
    }
))
