import {
    requireISODate,
    requireNonNegativeNumber,
    requirePeriodFilter
} from "../../shared/validators/index.js"

export function validateIncomePeriodQuery(query: Record<string, unknown>) {
    return {
        offset: requireNonNegativeNumber(query.offset ?? 0, "offset"),
        period: requirePeriodFilter(query.period ?? "week", "period")
    }
}

export function validateIncomeDayQuery(query: Record<string, unknown>) {
    return {
        date: requireISODate(query.date, "date"),
        period: requirePeriodFilter(query.period ?? "week", "period")
    }
}