import { requirePositiveInteger } from "./base.validators.js"
import { parseHistoryWindowQuery } from "./query.validators.js"

export function validatePersonHistoryParams(params: Record<string, unknown>) {
    return {
        id: requirePositiveInteger(params.id, "id")
    }
}

export function validatePersonHistoryQuery(query: Record<string, unknown>) {
    return parseHistoryWindowQuery(query)
}