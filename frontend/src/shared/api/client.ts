import axios from "axios"

import { API_BASE_URL } from "./config"

import type { AxiosRequestConfig } from "axios"

function readTokenValue(rawValue: string | null): string | null {
    if (!rawValue) {
        return null
    }

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

function getAuthToken(): string | null {
    if (typeof window === "undefined") {
        return null
    }

    const tokenKeys = [
        "manasiness_auth_session",
        "token",
        "accessToken",
        "authToken",
        "manasiness_token",
        "auth",
        "session"
    ]

    for (const key of tokenKeys) {
        const token = readTokenValue(window.localStorage.getItem(key))

        if (token) {
            return token
        }
    }

    return null
}

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use((config) => {
    const token = getAuthToken()

    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`)
    }

    return config
})

export async function apiGet<TResponse>(
    url: string,
    config?: AxiosRequestConfig
): Promise<TResponse> {
    const response = await api.get<TResponse>(url, config)
    return response.data
}

export async function apiPost<TResponse, TPayload = unknown>(
    url: string,
    payload?: TPayload,
    config?: AxiosRequestConfig
): Promise<TResponse> {
    const response = await api.post<TResponse>(url, payload, config)
    return response.data
}

export async function apiPut<TResponse, TPayload = unknown>(
    url: string,
    payload?: TPayload,
    config?: AxiosRequestConfig
): Promise<TResponse> {
    const response = await api.put<TResponse>(url, payload, config)
    return response.data
}

export async function apiPatch<TResponse, TPayload = unknown>(
    url: string,
    payload?: TPayload,
    config?: AxiosRequestConfig
): Promise<TResponse> {
    const response = await api.patch<TResponse>(url, payload, config)
    return response.data
}

export async function apiDelete<TResponse>(
    url: string,
    config?: AxiosRequestConfig
): Promise<TResponse> {
    const response = await api.delete<TResponse>(url, config)
    return response.data
}

export default api








