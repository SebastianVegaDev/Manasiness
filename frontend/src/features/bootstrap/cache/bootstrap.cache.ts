import {
    getStorageItem,
    removeStorageItem,
    setStorageItem
} from "@shared/storage/localStorage"

import type { BootstrapData } from "../shared/types/bootstrap.types"

const BOOTSTRAP_CACHE_KEY = "manasiness_bootstrap_cache"

export function getCachedBootstrapData(): BootstrapData | null {
    return getStorageItem<BootstrapData | null>(BOOTSTRAP_CACHE_KEY, null)
}

export function setCachedBootstrapData(data: BootstrapData): void {
    setStorageItem(BOOTSTRAP_CACHE_KEY, data)
}

export function clearCachedBootstrapData(): void {
    removeStorageItem(BOOTSTRAP_CACHE_KEY)
}







