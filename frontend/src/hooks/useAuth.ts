import {authStore} from "@/store/auth/auth.store";
import { cookies } from 'next/headers'

export function useAuth() {
    const isAuthenticated = authStore(state => state.isAuthenticated)
    const setIsAuthenticated = authStore(state => state.setIsAuthenticated)

    const auth = () => setIsAuthenticated(true)
    const exit = () => {
        cookies().then(r => r.delete('session'))
        setIsAuthenticated(false)
    }

    return {
        isAuthenticated,
        auth,
        exit,
    }
}
