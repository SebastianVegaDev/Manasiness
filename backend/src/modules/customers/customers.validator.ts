import {
    parseOptionalSearch,
    parseOptionalStatus,
    validatePersonHistoryParams,
    validatePersonHistoryQuery
} from "../../shared/validators/index.js"

export function validateCustomerFilters(query: Record<string, unknown>) {
    return {
        search: parseOptionalSearch(query.search, "search"),
        status: parseOptionalStatus(query.status, "status")
    }
}

export function validateCustomerDetailParams(params: Record<string, unknown>) {
    return validatePersonHistoryParams(params)
}

export function validateCustomerDetailQuery(query: Record<string, unknown>) {
    return validatePersonHistoryQuery(query)
}