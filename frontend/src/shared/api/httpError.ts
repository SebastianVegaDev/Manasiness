import { isAxiosError } from "axios"

import type { ApiErrorResponse } from "@shared/types/api.types"

export function getApiErrorMessage(error: unknown, fallbackMessage = "Something went wrong"): string {
    if (isAxiosError<ApiErrorResponse>(error)) {
        return (
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            fallbackMessage
        )
    }

    if (error instanceof Error) {
        return error.message
    }

    return fallbackMessage
}

export function getApiStatusCode(error: unknown): number | null {
    if (isAxiosError(error)) {
        return error.response?.status ?? null
    }

    return null
}

export function isUnauthorizedError(error: unknown): boolean {
    return getApiStatusCode(error) === 401
}

export function isForbiddenError(error: unknown): boolean {
    return getApiStatusCode(error) === 403
}

export function isNotFoundError(error: unknown): boolean {
    return getApiStatusCode(error) === 404
}










