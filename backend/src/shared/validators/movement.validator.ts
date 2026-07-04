import { MOVEMENT_STATES } from "../constants/movement-states.constants.js"
import {
    requireAllowedValue,
    requireNonNegativeNumber,
    requireObject,
    requirePositiveInteger,
    requirePositiveNumber
} from "./base.validators.js"
import { parseHistoryWindowQuery } from "./query.validators.js"

export function validateMovementWindowQuery(query: Record<string, unknown>) {
    return parseHistoryWindowQuery(query)
}

export function validateProductMovementPayload(body: unknown) {
    const data = requireObject(body)

    return {
        productId: requirePositiveInteger(data.product_id, "product_id"),
        userId: requirePositiveInteger(data.user_id, "user_id"),
        quantity: requirePositiveInteger(data.quantity, "quantity"),
        state: requireAllowedValue(data.state, MOVEMENT_STATES, "state")
    }
}

export function validateStaffMovementPayload(body: unknown) {
    const data = requireObject(body)

    return {
        userId: requirePositiveInteger(data.user_id, "user_id"),
        salary: requirePositiveNumber(data.salary, "salary"),
        state: requireAllowedValue(data.state, MOVEMENT_STATES, "state")
    }
}

export function validateNonNegativeStock(value: unknown, fieldName = "stock"): number {
    return requireNonNegativeNumber(value, fieldName)
}