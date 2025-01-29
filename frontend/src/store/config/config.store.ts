import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import { TypeBaseColor } from '@/libs/constants/colors.constants'
import { ConfigStore } from '@/store/config/config.types'

export const configStore = create(persist<ConfigStore>(
    set => ({
        theme: 'turquoise',
        setTheme: (theme: TypeBaseColor) => set({theme}),
    }),
    {
        name: 'config',
        storage: createJSONStorage(() => localStorage),
    }
))
