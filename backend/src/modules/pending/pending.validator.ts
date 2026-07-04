import {
    requireAllowedValue,
    requireObject,
    requirePositiveInteger
} from "../../shared/validators/index.js"
import { PENDING_RESOLVE_STATES, PENDING_SCOPES } from "./pending.constants.js"

export function validatePendingParams(params: Record<string, unknown>) {
    return {
        scope: requireAllowedValue(params.scope, PENDING_SCOPES, "scope"),
        id: requirePositiveInteger(params.id, "id")
    }
}

export function validatePendingStatePayload(body: unknown) {
    const data = requireObject(body)

    return {
        state: requireAllowedValue(data.state, PENDING_RESOLVE_STATES, "state")
    }
}