export function getStorageItem<T>(key: string, fallbackValue: T): T {
    if (typeof window === "undefined") {
        return fallbackValue
    }

    try {
        const value = window.localStorage.getItem(key)

        if (!value) {
            return fallbackValue
        }

        return JSON.parse(value) as T
    } catch {
        return fallbackValue
    }
}

export function setStorageItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") {
        return
    }

    window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageItem(key: string): void {
    if (typeof window === "undefined") {
        return
    }

    window.localStorage.removeItem(key)
}

export function clearStorage(): void {
    if (typeof window === "undefined") {
        return
    }

    window.localStorage.clear()
}

export function getStorageJson<T>(key: string, fallbackValue: T): T {
    return getStorageItem(key, fallbackValue)
}

export function setStorageJson<T>(key: string, value: T): void {
    setStorageItem(key, value)
}

export function removeStorageItemsByPrefix(prefix: string): void {
    if (typeof window === "undefined") {
        return
    }

    const keysToRemove: string[] = []

    for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index)

        if (key?.startsWith(prefix)) {
            keysToRemove.push(key)
        }
    }

    keysToRemove.forEach((key) => window.localStorage.removeItem(key))
}








