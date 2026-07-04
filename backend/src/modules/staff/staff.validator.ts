import {
    validateMovementWindowQuery,
    validateStaffMovementPayload
} from "../../shared/validators/index.js"

export function validateStaffQuery(query: Record<string, unknown>) {
    return validateMovementWindowQuery(query)
}

export function validateStaffPayload(body: unknown) {
    return validateStaffMovementPayload(body)
}