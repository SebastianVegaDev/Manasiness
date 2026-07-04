import {
    parseOptionalSearch,
    parseOptionalStatus,
    validatePersonHistoryParams,
    validatePersonHistoryQuery
} from "../../shared/validators/index.js"

export function validateSupplierFilters(query: Record<string, unknown>) {
    return {
        search: parseOptionalSearch(query.search, "search"),
        status: parseOptionalStatus(query.status, "status")
    }
}

export function validateSupplierDetailParams(params: Record<string, unknown>) {
    return validatePersonHistoryParams(params)
}

export function validateSupplierDetailQuery(query: Record<string, unknown>) {
    return validatePersonHistoryQuery(query)
}