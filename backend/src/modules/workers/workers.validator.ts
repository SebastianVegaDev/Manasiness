import {
    parseOptionalSearch,
    parseOptionalStatus,
    validatePersonHistoryParams,
    validatePersonHistoryQuery
} from "../../shared/validators/index.js"

export function validateWorkerFilters(query: Record<string, unknown>) {
    return {
        search: parseOptionalSearch(query.search, "search"),
        status: parseOptionalStatus(query.status, "status")
    }
}

export function validateWorkerDetailParams(params: Record<string, unknown>) {
    return validatePersonHistoryParams(params)
}

export function validateWorkerDetailQuery(query: Record<string, unknown>) {
    return validatePersonHistoryQuery(query)
}