import { apiGet, apiPatch, apiPost, apiPut } from "@shared/api/client"

import type {
    PeopleListParams,
    User,
    UserCreatePayload,
    UserUpdatePayload
} from "../../shared/types/people.types"
import type { EntityId } from "@shared/types/common.types"
import type { QueryParamValue } from "@shared/types/api.types"

type UserListResponse =
    | User[]
    | {
        rows?: User[]
        data?: User[]
        users?: User[]
    }

type UserResponse =
    | User
    | {
        data?: User
        user?: User
    }

function toRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" ? value as Record<string, unknown> : {}
}

function sanitizeParams(params: PeopleListParams = {}): Record<string, QueryParamValue> {
    const sanitizedParams: Record<string, QueryParamValue> = {}

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
            sanitizedParams[key] = value
        }
    }

    return sanitizedParams
}

function unwrapUserList(response: UserListResponse): User[] {
    if (Array.isArray(response)) {
        return response
    }

    const responseRecord = toRecord(response)

    if (Array.isArray(responseRecord.rows)) {
        return responseRecord.rows as User[]
    }

    if (Array.isArray(responseRecord.data)) {
        return responseRecord.data as User[]
    }

    if (Array.isArray(responseRecord.users)) {
        return responseRecord.users as User[]
    }

    return []
}

function unwrapUser(response: UserResponse): User {
    const responseRecord = toRecord(response)

    return (
        (responseRecord.user as User | undefined) ??
        (responseRecord.data as User | undefined) ??
        response as User
    )
}

export async function getUsers(params: PeopleListParams = {}): Promise<User[]> {
    const response = await apiGet<UserListResponse>("/users", {
        params: sanitizeParams(params)
    })

    return unwrapUserList(response)
}

export async function getUserById(id: EntityId): Promise<User> {
    const response = await apiGet<UserResponse>(`/users/${id}`)
    return unwrapUser(response)
}

export async function createUser(payload: UserCreatePayload): Promise<User> {
    const response = await apiPost<UserResponse, UserCreatePayload>("/users", payload)
    return unwrapUser(response)
}

export async function updateUser(id: EntityId, payload: UserUpdatePayload): Promise<User> {
    const response = await apiPut<UserResponse, UserUpdatePayload>(`/users/${id}`, payload)
    return unwrapUser(response)
}

export async function deactivateUser(id: EntityId): Promise<User> {
    const response = await apiPatch<UserResponse>(`/users/${id}/deactivate`)
    return unwrapUser(response)
}

export async function activateUser(id: EntityId): Promise<User> {
    const response = await apiPatch<UserResponse>(`/users/${id}/activate`)
    return unwrapUser(response)
}


