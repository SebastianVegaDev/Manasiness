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
                store?: { id?: unknown }
                user?: { id?: unknown }
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

            if (tokenObject.store?.id || tokenObject.user?.id) {
                return String(tokenObject.store?.id ?? tokenObject.user?.id)
            }
        }

        return null
    } catch {
        return rawValue
    }
}

export function getRouteAuthToken(): string | null {
    const tokenKeys = [
        "manasiness_auth_session",
        "manasiness_auth_store",
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








