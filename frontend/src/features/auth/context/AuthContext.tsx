import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"

import {
    getCurrentUserRequest,
    loginRequest,
    registerRequest
} from "../shared/api/auth.api"
import { mapAuthResponseToSession } from "../shared/mappers/auth.mapper"
import {
    clearStoredAuthSession,
    getStoredAuthSession,
    setStoredAuthSession
} from "../shared/storage/auth.storage"

import type {
    AuthContextValue,
    AuthSession,
    LoginCredentials,
    RegisterPayload
} from "../shared/types/auth.types"
import type { ReactNode } from "react"

export const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
    children: ReactNode
}

function hasSessionIdentity(session: AuthSession): boolean {
    return Boolean(session.token || session.store || session.user)
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [session, setSessionState] = useState<AuthSession>(() => getStoredAuthSession())
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const setSession = useCallback((nextSession: AuthSession) => {
        setSessionState(nextSession)
        setStoredAuthSession(nextSession)
    }, [])

    const logout = useCallback(() => {
        clearStoredAuthSession()
        setSessionState({
            store: null,
            user: null,
            token: null
        })
    }, [])

    const loadSession = useCallback(async () => {
        const storedSession = getStoredAuthSession()

        if (!hasSessionIdentity(storedSession)) {
            setSessionState(storedSession)
            setIsLoading(false)
            return null
        }

        try {
            setIsLoading(true)

            const response = await getCurrentUserRequest()
            const serverSession = mapAuthResponseToSession(response)
            const nextSession: AuthSession = {
                store: serverSession.store ?? storedSession.store,
                user: serverSession.user ?? storedSession.user,
                token: serverSession.token ?? storedSession.token
            }

            setSession(nextSession)

            return nextSession
        } catch (error) {
            console.error(error)

            if (storedSession.store || storedSession.user || storedSession.token) {
                setSessionState(storedSession)
                return storedSession
            }

            logout()
            return null
        } finally {
            setIsLoading(false)
        }
    }, [logout, setSession])

    useEffect(() => {
        loadSession()
    }, [loadSession])

    const login = useCallback(async (credentials: LoginCredentials) => {
        const response = await loginRequest(credentials)
        const nextSession = mapAuthResponseToSession(response)

        setSession(nextSession)

        return nextSession
    }, [setSession])

    const register = useCallback(async (payload: RegisterPayload) => {
        const response = await registerRequest(payload)
        const nextSession = mapAuthResponseToSession(response)

        setSession(nextSession)

        return nextSession
    }, [setSession])

    const logoutSession = useCallback(async () => {
        logout()
    }, [logout])

    const value = useMemo<AuthContextValue>(() => {
        return {
            store: session.store,
            user: session.user,
            token: session.token,
            isAuthenticated: hasSessionIdentity(session),
            isLoading,
            login,
            register,
            logout,
            setSession,
            loadSession,
            loginSession: loadSession,
            logoutSession
        }
    }, [isLoading, loadSession, login, logout, logoutSession, register, session, setSession])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider








