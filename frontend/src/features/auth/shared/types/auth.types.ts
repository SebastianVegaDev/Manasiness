import type { Nullable } from "@shared/types/common.types"

export type AuthStore = {
    id: string | number
    name: string
    email: string
    phone?: Nullable<string>
    image?: Nullable<string>
    currency_code?: string
    currencyCode?: string
}

export type AuthUser = {
    id: string | number
    name: string
    email: string
    role?: string
    image?: Nullable<string>
}

export type AuthSession = {
    store: AuthStore | null
    user: AuthUser | null
    token: string | null
}

export type LoginCredentials = {
    email: string
    password: string
}

export type RegisterPayload = {
    name: string
    email: string
    phone?: string
    image?: string
    password: string
    repassword?: string
    confirmPassword?: string
    code?: string
}

export type EmailCodePayload = {
    email: string
}

export type VerifyCodePayload = {
    email: string
    code: string
}

export type ResetPasswordPayload = {
    email: string
    code: string
    password: string
    repassword?: string
    confirmPassword?: string
}

export type ForgotPasswordPayload = {
    email: string
}

export type ForgotPasswordResponse = {
    message?: string
    success?: boolean
    [key: string]: unknown
}

export type AuthResponse = {
    store?: AuthStore
    user?: AuthUser
    token?: string
    accessToken?: string
    authToken?: string
    data?: {
        store?: AuthStore
        user?: AuthUser
        token?: string
        accessToken?: string
        authToken?: string
    }
    session?: {
        store?: AuthStore
        user?: AuthUser
        token?: string
        accessToken?: string
        authToken?: string
    }
    message?: string
}

export type AuthContextValue = {
    store: AuthStore | null
    user: AuthUser | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (credentials: LoginCredentials) => Promise<AuthSession>
    register: (payload: RegisterPayload) => Promise<AuthSession>
    logout: () => void
    setSession: (session: AuthSession) => void
    loadSession: () => Promise<AuthSession | null>
    loginSession: () => Promise<AuthSession | null>
    logoutSession: () => Promise<void>
}








