import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import {AuthStore} from "@/store/auth/auth.types";

export const authStore = create(persist<AuthStore>(
    set => ({
        isAuthenticated: false,
        setIsAuthenticated: (value: boolean) => set({isAuthenticated: value}),
    }),
    {
        name: 'auth',
        storage: createJSONStorage(() => localStorage),
    }
))
