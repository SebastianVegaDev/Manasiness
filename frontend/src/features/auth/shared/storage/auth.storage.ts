import {
    getStorageItem,
    removeStorageItem,
    removeStorageItemsByPrefix,
    setStorageItem
} from "@shared/storage/localStorage"

import type { AuthSession, AuthStore } from "../types/auth.types"

const AUTH_SESSION_KEY = "manasiness_auth_session"
const AUTH_STORE_KEY = "manasiness_auth_store"
const BOOTSTRAP_CACHE_PREFIX = "manasiness_bootstrap_cache_"
const LEGACY_TOKEN_KEYS = [
    "token",
    "accessToken",
    "authToken",
    "manasiness_token",
    "auth",
    "session"
]

const EMPTY_SESSION: AuthSession = {
    store: null,
    user: null,
    token: null
}

export function getStoredAuthSession(): AuthSession {
    const session = getStorageItem<AuthSession>(AUTH_SESSION_KEY, EMPTY_SESSION)
    const legacyStore = getStorageItem<AuthStore | null>(AUTH_STORE_KEY, null)

    const normalizedSession: AuthSession = {
        store: session.store ?? legacyStore,
        user: session.user ?? null,
        token: session.token ?? null
    }

    if (normalizedSession.token) {
        return normalizedSession
    }

    for (const key of LEGACY_TOKEN_KEYS) {
        const legacyToken = readLegacyStorageValue(key)

        if (legacyToken) {
            return {
                ...normalizedSession,
                token: legacyToken
            }
        }
    }

    return normalizedSession
}

export function setStoredAuthSession(session: AuthSession): void {
    setStorageItem(AUTH_SESSION_KEY, session)

    if (session.token) {
        setStorageItem("token", session.token)
    }

    if (session.store) {
        setStorageItem(AUTH_STORE_KEY, {
            id: session.store.id,
            name: session.store.name,
            email: session.store.email
        })
    }
}

export function clearStoredAuthSession(): void {
    removeStorageItem(AUTH_SESSION_KEY)
    removeStorageItem(AUTH_STORE_KEY)
    removeStorageItemsByPrefix(BOOTSTRAP_CACHE_PREFIX)

    for (const key of LEGACY_TOKEN_KEYS) {
        removeStorageItem(key)
    }
}

function readLegacyStorageValue(key: string): string | null {
    if (typeof window === "undefined") {
        return null
    }

    const rawValue = window.localStorage.getItem(key)

    if (!rawValue) {
        return null
    }

    return normalizeStoredToken(rawValue)
}

function normalizeStoredToken(rawValue: string): string | null {
    try {
        const parsedValue = JSON.parse(rawValue) as unknown

        if (typeof parsedValue === "string") {
            return parsedValue
        }

        if (parsedValue && typeof parsedValue === "object") {
            const tokenObject = parsedValue as {
                token?: unknown
                accessToken?: unknown
                authToken?: unknown
            }

            if (typeof tokenObject.token === "string") {
                return tokenObject.token
            }

            if (typeof tokenObject.accessToken === "string") {
                return tokenObject.accessToken
            }

            if (typeof tokenObject.authToken === "string") {
                return tokenObject.authToken
            }
        }

        return null
    } catch {
        return rawValue
    }
}








