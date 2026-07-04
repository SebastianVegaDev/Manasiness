import {
    parseOptionalImage,
    parseOptionalSearch,
    parseOptionalStatus,
    parseOptionalUserRole,
    requireAllowedValue,
    requireObject,
    requirePhone,
    requirePositiveInteger,
    requireText
} from "../../shared/validators/index.js"
import type { UserRole } from "../../types/person.types.js"

const USER_ROLES = ["customer", "worker", "supplier"] as const

export function validateUserFilters(query: Record<string, unknown>) {
    return {
        search: parseOptionalSearch(query.search, "search"),
        status: parseOptionalStatus(query.status, "status"),
        role: parseOptionalUserRole(query.role, "role")
    }
}

export function validateUserId(params: Record<string, unknown>) {
    return {
        id: requirePositiveInteger(params.id, "id")
    }
}

export function validateUserPayload(body: unknown) {
    const data = requireObject(body)

    return {
        name: requireText(data.name, "name"),
        image: parseOptionalImage(data.image, "image"),
        phone: requirePhone(data.phone, "phone"),
        role: requireAllowedValue(data.role, USER_ROLES, "role") as UserRole
    }
}