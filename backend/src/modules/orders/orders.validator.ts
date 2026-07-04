import {
    validateMovementWindowQuery,
    validateProductMovementPayload
} from "../../shared/validators/index.js"

export function validateOrdersQuery(query: Record<string, unknown>) {
    return validateMovementWindowQuery(query)
}

export function validateOrderPayload(body: unknown) {
    return validateProductMovementPayload(body)
}