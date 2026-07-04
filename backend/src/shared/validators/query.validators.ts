import { badRequest } from "../../errors/http-errors.js"
import { requireAllowedValue, requirePositiveInteger } from "./base.validators.js"

export type HistorySort = "recent" | "oldest"
export type SortDirection = "ASC" | "DESC"
export type HistoryPeriod = "day"

type PageSortQueryInput = {
    page?: unknown
    sort?: unknown
    limit?: unknown
}

type HistoryWindowQueryInput = PageSortQueryInput & {
    offset?: unknown
    period?: unknown
}

export function requirePage(value: unknown, fieldName = "page"): number {
    const parsed = Number(value)

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}

export function requireHistorySort(value: unknown, fieldName = "sort"): HistorySort {
    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    return requireAllowedValue(value.trim(), ["recent", "oldest"], fieldName)
}

export function requireSortDirection(value: unknown, fieldName = "sort"): SortDirection {
    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    return requireAllowedValue(value.trim(), ["ASC", "DESC"], fieldName)
}

export function requireNonNegativeOffset(value: unknown, fieldName = "offset"): number {
    const parsed = Number(value)

    if (!Number.isInteger(parsed) || parsed < 0) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}

export function requireHistoryPeriod(value: unknown, fieldName = "period"): HistoryPeriod {
    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    return requireAllowedValue(value.trim(), ["day"], fieldName)
}

export function parsePageSortQuery(query: PageSortQueryInput = {}) {
    const currentPage = requirePage(query.page ?? 1, "page")
    const parsedSort = requireHistorySort(query.sort ?? "recent", "sort")
    const parsedLimit = requirePositiveInteger(query.limit ?? 20, "limit")
    const offset = (currentPage - 1) * parsedLimit
    const orderDirection: SortDirection = parsedSort === "oldest" ? "ASC" : "DESC"

    return {
        page: currentPage,
        sort: parsedSort,
        limit: parsedLimit,
        offset,
        orderDirection
    }
}

export function parseHistoryWindowQuery(query: HistoryWindowQueryInput = {}) {
    const currentPage = requirePage(query.page ?? 1, "page")
    const parsedSort = requireHistorySort(query.sort ?? "recent", "sort")
    const parsedLimit = requirePositiveInteger(query.limit ?? 20, "limit")
    const parsedOffset = requireNonNegativeOffset(query.offset ?? 0, "offset")
    const parsedPeriod = requireHistoryPeriod(query.period ?? "day", "period")
    const rowOffset = (currentPage - 1) * parsedLimit
    const orderDirection: SortDirection = parsedSort === "oldest" ? "ASC" : "DESC"

    return {
        page: currentPage,
        sort: parsedSort,
        period: parsedPeriod,
        limit: parsedLimit,
        dayOffset: parsedOffset,
        rowOffset,
        orderDirection
    }
}