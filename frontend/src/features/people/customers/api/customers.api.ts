import { apiGet } from "@shared/api/client"

import type {
    PeopleListParams,
    Person
} from "../../shared/types/people.types"
import type { EntityId } from "@shared/types/common.types"
import type {
    PersonHistoryApiParams,
    PersonHistoryApiResponse
} from "@shared/types/personHistory.types"
import type { QueryParamValue } from "@shared/types/api.types"

type CustomerListResponse =
    | Person[]
    | {
        rows?: Person[]
        data?: Person[]
        customers?: Person[]
    }

type CustomerResponse =
    | PersonHistoryApiResponse
    | {
        data?: PersonHistoryApiResponse
        customer?: PersonHistoryApiResponse
    }

function toRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" ? value as Record<string, unknown> : {}
}

function sanitizeParams(params: PeopleListParams | PersonHistoryApiParams = {}): Record<string, QueryParamValue> {
    const sanitizedParams: Record<string, QueryParamValue> = {}

    for (const [key, value] of Object.entries(params)) {
        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            sanitizedParams[key] = value
        }
    }

    return sanitizedParams
}

function unwrapCustomerList(response: CustomerListResponse): Person[] {
    if (Array.isArray(response)) {
        return response
    }

    const responseRecord = toRecord(response)

    if (Array.isArray(responseRecord.rows)) return responseRecord.rows as Person[]
    if (Array.isArray(responseRecord.data)) return responseRecord.data as Person[]
    if (Array.isArray(responseRecord.customers)) return responseRecord.customers as Person[]

    return []
}

function unwrapCustomer(response: CustomerResponse): PersonHistoryApiResponse {
    const responseRecord = toRecord(response)

    return (
        responseRecord.customer as PersonHistoryApiResponse ??
        responseRecord.data as PersonHistoryApiResponse ??
        response as PersonHistoryApiResponse
    )
}

export async function getCustomers(params: PeopleListParams = {}): Promise<Person[]> {
    const response = await apiGet<CustomerListResponse>("/customers", {
        params: sanitizeParams(params)
    })

    return unwrapCustomerList(response)
}

export async function getCustomerById(
    id: EntityId,
    params: PersonHistoryApiParams = {}
): Promise<PersonHistoryApiResponse> {
    const response = await apiGet<CustomerResponse>(`/customers/${id}`, {
        params: sanitizeParams(params)
    })

    return unwrapCustomer(response)
}



