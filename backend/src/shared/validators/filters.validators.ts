import { badRequest } from "../../errors/http-errors.js"
import { requireAllowedValue, requireText } from "./base.validators.js"

export type StatusFilter = "all" | "active" | "inactive"
export type UserRoleFilter = "all" | "customer" | "supplier" | "worker"
export type PeriodFilter = "week" | "month"
export type CatalogOption = "topSold" | "leastSold"

export function requireISODate(value: unknown, fieldName = "date"): string {
    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    const parsed = value.trim()

    if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed)) {
        throw badRequest(`${fieldName} invalid`)
    }

    const year = Number(parsed.slice(0, 4))
    const month = Number(parsed.slice(5, 7))
    const day = Number(parsed.slice(8, 10))

    const date = new Date(Date.UTC(year, month - 1, day))

    if (
        Number.isNaN(date.getTime()) ||
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() + 1 !== month ||
        date.getUTCDate() !== day
    ) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}

export function requirePeriodFilter(value: unknown, fieldName = "period"): PeriodFilter {
    const parsed = requireText(value, fieldName)

    return requireAllowedValue(parsed, ["week", "month"], fieldName)
}

export function requireCatalogOption(value: unknown, fieldName = "catalogOption"): CatalogOption {
    const parsed = requireText(value, fieldName)

    return requireAllowedValue(parsed, ["topSold", "leastSold"], fieldName)
}

export function parseOptionalSearch(value: unknown, fieldName = "search"): string {
    if (value === undefined || value === null || value === "") {
        return ""
    }

    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    return value.trim()
}

export function parseOptionalStatus(value: unknown, fieldName = "status"): StatusFilter {
    if (value === undefined || value === null || value === "") {
        return "all"
    }

    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    return requireAllowedValue(value.trim(), ["all", "active", "inactive"], fieldName)
}

export function parseOptionalUserRole(value: unknown, fieldName = "role"): UserRoleFilter {
    if (value === undefined || value === null || value === "") {
        return "all"
    }

    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    return requireAllowedValue(value.trim(), ["all", "customer", "supplier", "worker"], fieldName)
}

export function parseOptionalPositiveInteger(value: unknown, fieldName = "value"): number | null {
    if (value === undefined || value === null || value === "") {
        return null
    }

    const parsed = Number(value)

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}