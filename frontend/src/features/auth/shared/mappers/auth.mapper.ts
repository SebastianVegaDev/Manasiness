import type {
    AuthResponse,
    AuthSession,
    AuthStore,
    AuthUser
} from "../types/auth.types"

function getResponseStore(response: AuthResponse): AuthStore | null {
    return (
        response.store ??
        response.data?.store ??
        response.session?.store ??
        null
    )
}

function getResponseUser(response: AuthResponse): AuthUser | null {
    return (
        response.user ??
        response.data?.user ??
        response.session?.user ??
        null
    )
}

function getResponseToken(response: AuthResponse): string | null {
    return (
        response.token ??
        response.accessToken ??
        response.authToken ??
        response.data?.token ??
        response.data?.accessToken ??
        response.data?.authToken ??
        response.session?.token ??
        response.session?.accessToken ??
        response.session?.authToken ??
        null
    )
}

export function mapAuthResponseToSession(response: AuthResponse): AuthSession {
    const store = getResponseStore(response)
    const user = getResponseUser(response)

    return {
        store,
        user,
        token: getResponseToken(response)
    }
}








