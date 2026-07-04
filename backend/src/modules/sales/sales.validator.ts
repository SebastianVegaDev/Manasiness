import {
    validateMovementWindowQuery,
    validateProductMovementPayload
} from "../../shared/validators/index.js"

export function validateSalesQuery(query: Record<string, unknown>) {
    return validateMovementWindowQuery(query)
}

export function validateSalePayload(body: unknown) {
    return validateProductMovementPayload(body)
}