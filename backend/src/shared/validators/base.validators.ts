import { badRequest } from "../../errors/http-errors.js"

export function requireText(value: unknown, fieldName: string): string {
    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    const parsed = value.trim()

    if (!parsed) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}

export function requireAllowedValue<T extends string>(
    value: unknown,
    allowedValues: readonly T[],
    fieldName: string
): T {
    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    if (!allowedValues.includes(value as T)) {
        throw badRequest(`${fieldName} invalid`)
    }

    return value as T
}

export function requirePositiveInteger(value: unknown, fieldName: string): number {
    const parsed = Number(value)

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}

export function requirePositiveNumber(value: unknown, fieldName: string): number {
    const parsed = Number(value)

    if (!Number.isFinite(parsed) || parsed <= 0) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}

export function requireNonNegativeNumber(value: unknown, fieldName: string): number {
    const parsed = Number(value)

    if (!Number.isFinite(parsed) || parsed < 0) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}

export function requireObject(value: unknown, fieldName = "body"): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw badRequest(`${fieldName} invalid`)
    }

    return value as Record<string, unknown>
}