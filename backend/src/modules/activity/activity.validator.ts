import {
    requireCatalogOption,
    requireNonNegativeNumber,
    requirePeriodFilter
} from "../../shared/validators/index.js"

export function validateActivityBaseQuery(query: Record<string, unknown>) {
    return {
        offset: requireNonNegativeNumber(query.offset ?? 0, "offset"),
        activityDateFilter: requirePeriodFilter(query.activityDateFilter ?? "week", "activityDateFilter")
    }
}

export function validateCatalogPerformanceQuery(query: Record<string, unknown>) {
    return {
        ...validateActivityBaseQuery(query),
        catalogOption: requireCatalogOption(query.catalogOption ?? "topSold", "catalogOption")
    }
}