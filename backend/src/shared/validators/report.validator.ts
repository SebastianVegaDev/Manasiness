import { requireNonNegativeNumber } from "./base.validators.js"
import {
    requireISODate,
    requirePeriodFilter
} from "./filters.validators.js"

export function validateReportPeriodQuery(query: Record<string, unknown>) {
    return {
        offset: requireNonNegativeNumber(query.offset ?? 0, "offset"),
        period: requirePeriodFilter(query.period ?? "week", "period")
    }
}

export function validateReportDayQuery(query: Record<string, unknown>) {
    return {
        date: requireISODate(query.date, "date"),
        period: requirePeriodFilter(query.period ?? "week", "period")
    }
}